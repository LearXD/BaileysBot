import { IBotData } from "../interfaces/IBotData";

import { downloadImage, getRandomName, isAdmin, onlyNumbers } from "../functions";
import { query } from '../visionManager';


export default async ({ reply, isImage, webMessage}: IBotData) => {
   
    if (!isImage) {
        return await reply("⚠ Por favor, envie uma imagem!");
    }

    const imagePath = await downloadImage(webMessage, getRandomName());
    const res = await query(imagePath, "TEXT_DETECT");
    
    await reply(
    `
🤖 Informações extraidas!

*Texto da imagem:* 

${res.fullTextAnnotation.text}
    `)
}