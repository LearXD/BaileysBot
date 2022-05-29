/*
* PARA AQUELES QUE DESEJAM UTILIZAR ESTA FERRAMENTO, CRIA UMA CREDENCIAL E COLE EM "vision_auth.json"...
*/


import path from 'path';

import vision from '@google-cloud/vision';
import { readJSON } from './functions';

export const query = async (imagePath: string, queryType: "TEXT_DETECT" | "TEST") => {

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
    }
}