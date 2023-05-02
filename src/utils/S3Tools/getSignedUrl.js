import AWS from "aws-sdk";
import { config } from 'dotenv';

config();

const getSignedUrl = async (key) => {
    const s3 = new AWS.S3();

    const params = {
        Bucket: process.env.BUCKET_NAME,
        Key: key,
    };

    const res = await s3.getSignedUrlPromise('getObject', params);
    return res;
}

export default getSignedUrl;
