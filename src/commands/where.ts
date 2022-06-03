import { IBotProperties } from '../interfaces';


import fs from 'fs';

import { downloadImage, getRandomName, isAdmin, onlyNumbers } from "../botManager";
import { query } from '../libs/visionManager';

export const desciption = {
    usage: `where (imagem)`,
    desciption: `Receba a localização da imagem`
  }

export default async ({ reply, isImage, webMessage, socket, remoteJid}: IBotProperties) => {
   
   
    if (!isImage) {
        return await reply("⚠ Por favor, envie uma imagem!");
    }

    const imagePath = await downloadImage(webMessage, getRandomName());

    await reply("🔎 PROCESSANDO TEXTO...")

    const res = await query(imagePath, "LANDMARK");
    fs.unlinkSync(imagePath)

    if(res.landmarkAnnotations.length < 1) {
        return await reply("😴 Nenhuma localização encontrada!")
    } 

    const location = res.landmarkAnnotations[0];
    const { latitude, longitude } = location.locations[0].latLng;

    await reply(
        `
🗺 *Localização encontrada*...
    
*Local:* ${location.description}

Localização:
        `)

    await socket.sendMessage(remoteJid, {
        location: { degreesLatitude: latitude, degreesLongitude: longitude }
    })
    
    
}