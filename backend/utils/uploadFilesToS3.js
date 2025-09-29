import { PutObjectCommand } from "@aws-sdk/client-s3";
import s3 from "../connections/s3.js";

const uploadFilesToS3 = async (files) => {
    if (!files || files.length === 0) return [];

    // transformam într-un array dacă e un singur fisier pentru ca logica de mai jos e construita pt arrays
    const filesArray = Array.isArray(files) ? files : [files];

    const uploadedFiles = [];

    for (const file of filesArray) {
        const key = `${Date.now()}-${file.originalname}`; // pentru a evita duplicatele => noua denumire ca să nu fie nume duplicate
        const params = {
            Bucket: process.env.BUCKET_NAME,
            Key: key,
            Body: file.buffer, //the image/data itself
            ContentType: file.mimetype //tipul de continut al fisierului
        };

        try {
            const command = new PutObjectCommand(params);
            await s3.send(command);

            const imageKey = key; //salvam key din aws s3, care e atribuit fiecarui obiect in bucket ca un identificator
            uploadedFiles.push(imageKey);
        } catch (err) {
            console.log(err);
            throw createPublicError("Eroare internă.", 400);
        }
    }

    return uploadedFiles;
};

export default uploadFilesToS3;