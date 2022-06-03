import speech from '@google-cloud/speech'
import { readJSON } from '../botManager';
import path from 'path';

import ffmpeg from "fluent-ffmpeg";

import fs from 'fs';

export const toText = async (filePath: string, cb: any) => {

    const CREDENTIALS = readJSON(path.join(__dirname, '..', '..', 'settings', 'cloud_google_auth_file.json'));

    const client = new speech.SpeechClient({
        credentials: CREDENTIALS,
        projectId: CREDENTIALS.project_id
    });

    ffmpeg(filePath)
        .input(filePath)
        .on("error", (error: any) => console.log(error))
        .on("end", async () => {
            const audioFile = fs.readFileSync(filePath.replace('ogg', 'wav'));
            const audioBytes = audioFile.toString('base64')
            fs.unlinkSync(filePath.replace('ogg', 'wav'));

            const [response] = await client.recognize({
                audio: {
                    content: audioBytes
                },
                config: {
                    encoding: 'LINEAR16',
                    sampleRateHertz: 48000,
                    languageCode: 'pt-BR',
                },
            });

            cb(response.results.map(result => result.alternatives[0].transcript).join('\n'));
        })
        .toFormat("wav")
        .save(filePath.replace('ogg', 'wav'));
}