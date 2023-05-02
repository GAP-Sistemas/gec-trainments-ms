import connectToDatabase from "../utils/database/db";
import { map as asyncMap } from "p-iteration";
import moment from "moment";
import shortid from 'shortid';
import { config } from 'dotenv';
import { ObjectId, Db } from 'mongodb';
import getSignedUrl from "../utils/S3Tools/getSignedUrl";
import jsReportLambda from "../utils/jsreport-lambda";
import putObject from "../utils/S3Tools/putObject";

config();

interface ISignature {
  key: string;
}

interface Instructor {
  name: string;
  signature: ISignature;
}

const getTrainment = async (employeeId: ObjectId, trainmentId: ObjectId, tenantId: ObjectId, db: Db) => {
  const aggregation = [
    {
      $match: { _id: new ObjectId(trainmentId), tenant: tenantId, deleted: false }
    },
    {
      $lookup: { from: "documentemployees", localField: "documentEmployee", foreignField: "_id", as: "documentEmployee" }
    },
    {
      $lookup: { from: "sites", localField: "site", foreignField: "_id", as: "site" }
    },
    {
      $unwind: { path: "$attendance", preserveNullAndEmptyArrays: true }
    },
    {
      $lookup: { from: "employees", localField: "attendance.employee", foreignField: "_id", as: "attendance.employee" }
    },
    {
      $match: { "attendance.employee._id": new ObjectId(employeeId) }
    },
    {
      $lookup: { from: "files", localField: "attendance.signature", foreignField: "_id", as: "attendance.signature" }
    },
    {
      $unwind: { path: "$instructors", preserveNullAndEmptyArrays: true }
    },
    {
      $lookup: { from: "files", localField: "instructors.signature", foreignField: "_id", as: "instructors.signature" }
    },
    {
      $lookup: { from: "tenants", localField: "tenant", foreignField: "_id", as: "tenant" }
    },
    {
      $unwind: { path: "$tenant", preserveNullAndEmptyArrays: true }
    },
    {
      $lookup: { from: "photos", localField: "tenant.photo", foreignField: "_id", as: "tenant.photo" }
    },
    {
      $group: {
        _id: "$_id",
        documentEmployee: { $first: "$documentEmployee" },
        site: { $first: "$site" },
        scheduledTime: { $first: "$scheduledTime" },
        description: { $first: "$description" },
        attendance: { $addToSet: "$attendance" },
        instructors: { $addToSet: "$instructors" },
        tenant: { $addToSet: "$tenant" }
      }
    },
    {
      $project: {
        _id: 1,
        "documentEmployee.name": 1,
        "site.name": 1,
        "scheduledTime": 1,
        "description": 1,
        "instructors.name": 1,
        "instructors.signature.key": 1,
        "tenant.photo.key": 1,
        "tenant.name": 1,
        "tenant._id": 1,
        "attendance.employee._id": 1,
        "attendance.employee.name": 1,
        "attendance.employee.cpf": 1,
        "attendance.signature.key": 1,
        "attendance.approved": 1,
      }
    }
  ];

  const [trainment] = await db.collection('trainments').aggregate(aggregation).toArray();;

  return trainment;
};

const signAndStructureData = async (trainmentInfo) => {

  const { attendance, tenant, instructors, ...trainmentData } = trainmentInfo

  const instructorsData = async () => {
    const instructorsData = await asyncMap(instructors, async (instructor: Instructor) => ({
      name: instructor.name,
      signature: instructor.signature? await getSignedUrl(instructor?.signature[0]?.key) : '',
    }))
    return instructorsData;
  }
  
  
  const dataCreator = async () =>  {
    const data =  {
      employee: {
      name: attendance[0].employee[0].name,
      cpf: attendance[0].employee[0].cpf,
      signature: attendance[0].signature[0].key ? await getSignedUrl(attendance[0].signature[0].key) : ''

      },
      instructors: await instructorsData(),
      trainment: {
        _id: trainmentData._id,
        documentEmployee: trainmentData.documentEmployee[0].name,
        site: trainmentData.site[0].name,
        scheduledTime: trainmentData.scheduledTime,
        description: trainmentData?.description ? trainmentData.description : null,
      },
      tenant: {
        name: tenant[0].name,
        url: tenant[0]?.photo[0]?.key ? await getSignedUrl(tenant[0]?.photo[0]?.key) : '',
      }
    }
    return data;
  }

  return dataCreator();

}

const generateCertificate = async (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  // const environment = process.env.STAGE;
  
  const record = event.Records[0];
  const body = JSON.parse(record.body);
  const { employeeId, trainmentId, tenantId } = body;

  // const trainmentId = "6388d859bd71f32518aba221";
  // const employeeId = "633343a722cb0f796153e3d5";

  const db = await connectToDatabase();
    
  // GET TRAINMENT 
  const trainmentData = await getTrainment(new ObjectId(employeeId), new ObjectId(trainmentId), new ObjectId(tenantId), db);

  // STRUCTURE DATA AND SIGN PHOTOS
  const dataToCertificate = await signAndStructureData(trainmentData);

  // GENERATE CERTIFICATES PDF    
  const shortIdJSReport = process.env.JSREPORT_CERTIFICATE_SHORT_ID
  const bodyBuffer = await jsReportLambda(shortIdJSReport, dataToCertificate)

  const name = `${dataToCertificate.employee.name}-certificate-${moment().format('DD-MM-YYYY HH:mm')}-${shortid.generate()}.pdf`
  const folder = 'certificates'

  try {
    // save certificates on bucket
    const uploadedResponse = await putObject(folder, name, bodyBuffer)
  
    const file = {
      tenant: new ObjectId(tenantId),
      name,
      key: uploadedResponse.Key,
      fileType: "application/pdf",
      deleted: false,
      size:  bodyBuffer.length,
    };
  
    // save in DB
    const { insertedId } = await db.collection('files').insertOne(file)

    const updateResult = await db.collection("employees").updateOne(
      { 
        _id: new ObjectId(employeeId), 
        "documents.trainment": new ObjectId(trainmentId) 
      },
      { 
        $push: { "documents.$.files": new ObjectId(insertedId) } 
      }
    );
  
  } catch (err) {
    console.log(err)
  }
 
  callback(null, {
      statusCode: 200,
      body: JSON.stringify({ message: "Certificate generated" })
  });
}

export const handler = generateCertificate;

