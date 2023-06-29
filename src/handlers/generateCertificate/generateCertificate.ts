import connectToDatabase from "../../utils/database/db";
import { SQSEvent, SQSHandler, Context, Callback } from 'aws-lambda';
import { config } from 'dotenv';
import { ObjectId } from 'mongodb';
import putObject from "../../utils/S3Tools/putObject";
import getSignedUrl from "../../utils/S3Tools/getSignedUrl";
import { getTrainment } from "./getTrainment";
import { signAndStructureData } from "./signAndStructureData";
import { generatePdf } from "./generatePdf";
import { populateDatabase } from "./populateDatabase";



config();


const generateCertificate: SQSHandler = async (event: SQSEvent, context: Context, callback: Callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  // const environment = process.env.STAGE;
  
  const record = event.Records[0];
  const body = JSON.parse(record.body);
  const { employeeId, trainmentId, tenantId } = body.data;
  
  // const employeeId = "64899d631a3b3e5bfac05d86";
  // const tenantId = "5d49e06505d1aa3ed4fb4964";
  // const trainmentId = "649db26be0f7c0cd008ae85c";
  
  console.log("tenantId:", tenantId)
  console.log("trainmentId:", trainmentId)
  console.log("employeeId:", employeeId)


  try {
    const db = await connectToDatabase();

    // GET TRAINMENT INFO
    const trainmentData = await getTrainment(new ObjectId(employeeId), new ObjectId(trainmentId), new ObjectId(tenantId), db);

    // STRUCTURE DATA AND SIGN PHOTOS
    const dataToCertificate = await signAndStructureData(trainmentData, getSignedUrl);
  
    // GENERATE CERTIFICATES PDF IN JS REPORT  
    
    const { bodyBuffer, name, folder } = await generatePdf(dataToCertificate);

    // SAVE CERTIFICATE ON AWS BUCKET
    const uploadedResponse = await putObject(folder, name, bodyBuffer)
  
    const file = {
      tenant: new ObjectId(tenantId),
      name,
      key: uploadedResponse.Key,
      fileType: "application/pdf",
      deleted: false,
      size:  bodyBuffer.length,
    };
  
    // POPULATE FILES WITH PDF AND RESPECTIVE EMPLOYEE.DOCUMENT WITH FILE ID
    await populateDatabase(db, file, employeeId, trainmentId);
  
  } catch (err) {
    console.log(err)
  }
 
  callback(null, {
      statusCode: 200,
      body: JSON.stringify({ message: "Certificate generated" })
  });
}

export const handler = generateCertificate;
