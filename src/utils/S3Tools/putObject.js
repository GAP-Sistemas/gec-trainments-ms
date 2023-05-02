import AWS from "aws-sdk";
import { config } from 'dotenv';

config();

const putObject = async (folder, name, bodyBuffer) => {
    const s3 = new AWS.S3();

    const res = await s3.upload({
      Key: `${folder}/${name}`,
      Bucket: process.env.BUCKET_NAME,
      Body: bodyBuffer,
      ACL: 'private',
      ContentType: 'application/pdf'
    }).promise();

    return res;
}

export default putObject;
