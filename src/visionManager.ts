/*
* PARA AQUELES QUE DESEJAM UTILIZAR ESTA FERRAMENTO, CRIA UMA CREDENCIAL E COLE EM "vision_auth.json"...
*/


import path from 'path';

import vision from '@google-cloud/vision';
import { readJSON } from './functions';

export const query = async (
    imagePath: string,
    queryType: "TEXT_DETECT" | "DOCUMENT_TEXT" | "LANDMARK" | "IMAGE_PROPETIES" | "WEB_DETECTION" | "OBJECT_DETECTION"
) => {

    const authPath = path.join(__dirname, '..', 'settings', 'vision_auth.json');
    const CREDENTIALS = readJSON(authPath);

    const client = new vision.ImageAnnotatorClient({
        credentials: {
            private_key: CREDENTIALS.private_key,
            client_email: CREDENTIALS.client_email
        }
    })

    switch (queryType) {
        case "TEXT_DETECT":
            return (await client.textDetection(imagePath))[0];
        case "DOCUMENT_TEXT":
            return (await client.documentTextDetection(imagePath))[0];
        case "LANDMARK":
            return (await client.landmarkDetection(imagePath))[0];
        case "IMAGE_PROPETIES":
            return (await client.imageProperties(imagePath))[0];
        case "WEB_DETECTION":
            return (await client.webDetection(imagePath))[0];
        case "OBJECT_DETECTION":
            return (await client.objectLocalization(imagePath))[0];
    }
}