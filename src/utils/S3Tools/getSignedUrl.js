import AWS from "aws-sdk";
import { config } from 'dotenv';

config();

const getSignedUrl = async (key) => {
    const s3 = new AWS.S3({
        accessKeyId: process.env.AWS_S3_UPLOAD_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_S3_UPLOAD_SECRET_ACCESS_KEY,
        signatureVersion: 'v4',
        region: process.env.BUCKET_REGION,
    });

    const params = {
        Bucket: process.env.BUCKET_NAME,
        Key: key,
        Expires: 60 * 60
    };

    const res = await s3.getSignedUrlPromise('getObject', params);
    return res;
}

export default getSignedUrl;
