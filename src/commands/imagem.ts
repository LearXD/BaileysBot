import { IBotData } from "../interfaces/IBotData";
import fs from 'fs';
import { downloadImage, getRandomName, isAdmin, onlyNumbers } from "../functions";
import { query } from '../visionManager';

import util from 'util';


export default async ({ reply, isImage, webMessage}: IBotData) => {
   
    if (!isImage) {
        return await reply("⚠ Por favor, envie uma imagem!");
    }

    const imagePath = await downloadImage(webMessage, getRandomName());
    await reply("🔎 FAZENDO BUSCA...")
    const res = await query(imagePath, "WEB_DETECTION");
    fs.unlinkSync(imagePath)
    
    console.log(util.inspect(res, {showHidden: false, depth: null, colors: true}))
}