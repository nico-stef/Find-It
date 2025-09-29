import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import s3 from "../connections/s3.js"

//ia un array de oject keys dintr-un bucket S3 si genereaza URL public, temporar 
const generateSignedUrls = async (images) => {
    if (!images || images.length === 0) return [];

    // transformăm într-un array dacă e un singur string
    const keys = Array.isArray(images) ? images : [images];

    const urls = await Promise.all(
        keys.map(async (key) => {
            const command = new GetObjectCommand({
                Bucket: process.env.BUCKET_NAME,
                Key: key
            });
            return await getSignedUrl(s3, command, { expiresIn: 3600 }); //1 hour
        })
    );

    return urls; //returneaza array de URL-uri presigned
};

export default generateSignedUrls;