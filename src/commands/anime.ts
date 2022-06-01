import { downloadImage, formatText, getRandomName } from "../functions";
import { IBotData } from "../interfaces/IBotData";

import fs from "fs";
import fetch from "node-fetch";

import { query } from '../anilistManager';

export const desciption = {
    usage: `anime (marque ou envie uma imagem)`,
    desciption: `Descubra o anime e episódio através de uma imagem!`
}

export default async ({ socket, reply, isImage, webMessage, remoteJid, args }: IBotData) => {

    if (!isImage && args.length < 1) {
        return await reply("😰 Por favor, envie uma imagem ou escreva o nome do anime que deseja procurar!");
    }

    let animeData: any;
    let extraMessage = "";

    try {
        if (isImage) {
            const imagePath = await downloadImage(webMessage, getRandomName());
            await reply("😶🔎 Procurando Anime...")
    
            const res = JSON.parse(await (await fetch("https://api.trace.moe/search", {
                method: "POST",
                body: fs.readFileSync(imagePath),
                headers: { "Content-type": "image/jpeg" },
            })).text());
    
            fs.unlinkSync(imagePath)
    
            if (res.error !== "") {
                return await reply("🥶 Um erro ocorreu ao procurar o anime!\nErro: " + res.error)
            }
    
            extraMessage = `
    🔥 Frames analizados: ${res.frameCount}
    
    Episódio da Imagem: ${res.result[0].episode}
    Frames: ${res.result[0].from} => ${res.result[0].to}
    Semelhança: ${Math.round(res.result[0].similarity * 100)}
            `
    
            animeData = await query(res.result[0].anilist, 'Media', 'ANIME', 'id');
    
        } else {
            await reply("😶🔎 Procurando Anime...")
            //TODO: Search by Gender...
            animeData = await query(args.join(" "), 'Media', 'ANIME', 'search');
        }
    } catch(error) {
        console.log(error)
        return await reply("😫 Não foi possivel encontrar o anime, verifique se você escreveu o nome corretamente, ou se a imagem enviada faz parte de alguma cena do anime!")
    }
    

    let message = `😎 *ANIME ENCONTRADO* 🔎
  ${extraMessage}
  *Título*: ${formatText(animeData.title.romaji)}
  *Título Original*: ${formatText(animeData.title.native)}
  
  *Descrição*: ${formatText(animeData.description)}

  *Lançamento*: ${animeData.startDate.day}/${animeData.startDate.month}/${animeData.startDate.year}
  *Ultima Atualização*: ${animeData.endDate.day}/${animeData.endDate.month}/${animeData.endDate.year}
  *Episódios*: ${animeData.episodes}
  *Capítulos*: ${animeData.chapters ?? (animeData.volumes ?? "Sem Informações")}

  *Generos*: ${animeData.genres.join(", ")}

  *Pontuação*: ${animeData.averageScore}/100`;

    await await socket.sendMessage(remoteJid,
        {
            image: { url: formatText(animeData.coverImage?.large.replace('medium', 'large') ?? animeData.coverImage?.medium) },
            caption: message,
        })

}