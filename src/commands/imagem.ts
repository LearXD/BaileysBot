import { IBotProperties } from '../interfaces';
import fs from 'fs';
import { downloadImage, getRandomName, isAdmin, onlyNumbers } from "../botManager";
import { query } from '../libs/visionManager';

import util from 'util';


export default async ({ reply, isImage, webMessage}: IBotProperties) => {
   
    if (!isImage) {
        return await reply("⚠ Por favor, envie uma imagem!");
    }

    const imagePath = await downloadImage(webMessage, getRandomName());
    await reply("🔎 FAZENDO BUSCA...")
    const res = await query(imagePath, "ADULT_DETECTION");
    fs.unlinkSync(imagePath)
    
    console.log(util.inspect(res, {showHidden: false, depth: null, colors: true}))
}