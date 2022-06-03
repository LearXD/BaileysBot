import { IBotProperties } from '../interfaces';
import fs from 'fs';
import { downloadImage, getRandomName } from "../botManager";
import { query } from '../libs/visionManager';

export const desciption = {
    usage: `search (marque ou envie uma imagem)`,
    desciption: `Descubra informações e os sites de uma imagem!`
  }


export default async ({ reply, isImage, webMessage, socket, remoteJid}: IBotProperties) => {
   
    if (!isImage) {
        return await reply("⚠ Por favor, envie uma imagem!");
    }

    const imagePath = await downloadImage(webMessage, getRandomName());

    await reply("🔎 FAZENDO BUSCA...")

    const res = await query(imagePath, "WEB_DETECTION");
    fs.unlinkSync(imagePath)

    const searchData = res.webDetection;
    let linksText = "🔗 *LINKS RELACIONADOS* ⤵\n\n";

    searchData.pagesWithMatchingImages.map(({url, pageTitle}) => {
        linksText += "*➣ Título:* " + pageTitle.replace(/<[^>]*>?/gm, '') + "\n*➢ Link*: " + url + "\n\n"
    })

    await socket.sendMessage(remoteJid, {
        image: { url: searchData?.fullMatchingImages[0]?.url ?? "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Unknown_person.jpg/813px-Unknown_person.jpg" },
        caption: `
        😵 Busca feita com sucesso!
        
*Palavra-Chave:* ${searchData.bestGuessLabels[0].label}
        
        ${linksText}
        `}, { quoted: webMessage}
    )
}