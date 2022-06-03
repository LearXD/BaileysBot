import { IBotProperties } from '../interfaces';

import fs from 'fs';

import { downloadImage, getRandomName, isAdmin, onlyNumbers } from "../botManager";
import { query } from '../libs/visionManager';

export const desciption = {
    usage: `imgtexto (documento|imagem)`,
    desciption: `Receba todo o texto de uma imagem.`
  }

export default async ({ reply, isImage, webMessage}: IBotProperties) => {
   
    if (!isImage) {
        return await reply("⚠ Por favor, envie uma imagem!");
    }

    const imagePath = await downloadImage(webMessage, getRandomName());

    await reply("🔎 PROCESSANDO TEXTO...")

    const res = await query(imagePath, "TEXT_DETECT");
    fs.unlinkSync(imagePath)
    
    await reply(
    `
🤖 Informações extraidas!

*Texto da imagem:* 

${res.fullTextAnnotation.text}
    `)
}