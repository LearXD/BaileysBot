import { downloadImage, formatText, getRandomName } from "../botManager";
import { IBotProperties } from '../interfaces';

import { translate  } from '../libs/translateManager';

import fs from "fs";
import fetch from "node-fetch";

import { query } from '../libs/anilistManager';
import axios from "axios";

export const desciption = {
    usage: `anime (marque ou envie uma imagem)`,
    desciption: `Descubra o anime e episódio através de uma imagem!`
}

export default async ({ socket, reply, isImage, webMessage, remoteJid, args }: IBotProperties) => {

    if (!isImage && args.length < 1) {
        return await reply("😰 Por favor, envie uma imagem ou escreva o nome do anime que deseja procurar!");
    }

    let animeData: any;
    let extraMessage = "";

    let searchType: string = 'anime';

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
            const animes = (res?.result.length < 1 ? [] : res.result.filter((a: any) => ((a.similarity * 100) > 83)))

            if (res.error !== "" || animes.length < 1) {
                throw new Error(res.error);
            }

            extraMessage = `
    🔥 Frames analizados: ${res.frameCount}
    
    Episódio da Imagem: ${animes[0].episode}
    Frames: ${animes[0].from} => ${animes[0].to}
    Semelhança: ${Math.round(animes[0].similarity * 100)}%
            `
            animeData = await query(animes[0].anilist, 'Media', 'ANIME', 'id');
        } else {
            await reply("😶🔎 Procurando Anime...")
            switch (args[0]) {
                case 'character':
                    searchType = args.shift();
                    animeData = await query(args.join(' '), 'Character', 'ANIME', 'search');
                    break;
                default: 
                    animeData = await query(args.join(" "), 'Media', 'ANIME', 'search');
            }

        }
    } catch (error) {
        console.log(error)
        return await reply("😫 Não foi possivel encontrar o anime, verifique se você escreveu o nome corretamente, ou se a imagem enviada faz parte de alguma cena do anime!")
    }

    let imageUrl: any;

    try {
        await axios.get((animeData.coverImage ?? animeData.image).large.replace('medium', 'large'));
        imageUrl = (animeData.coverImage ?? animeData.image).large.replace('medium', 'large');
    } catch (error) {
        await axios.get((animeData.coverImage ?? animeData.image).medium);
        imageUrl = (animeData.coverImage ?? animeData.image).medium;
    }

    let message: string;

    if (args) {
        switch(searchType) {
            case "character":
                message = `😎 *PERSONAGEM ENCONTRADO* 🔎

    *Nome:* ${animeData.name.full ?? "Não encontrado."}
    *Original:* ${animeData.name.native ?? "Não encontrado."}
        
    *Gênero:* ${!animeData.gender ? 'Indefinido' : (animeData.gender === 'Male' ? 'Masculino' : 'Feminino')}

    
    *Descrição:* ${!animeData.description ? "Não Encontrado." : await translate(animeData.description.replace(/__/g, '*').replace(/~/g, '').replace(/\n/g, "\n    "), 'pt')}

    *Idade:* ${animeData.age ?? "Não encontrado"}
    *Nascimento:* ${animeData.dateOfBirth.day ?? "??"}/${animeData.dateOfBirth.month ?? "??"}/${animeData.dateOfBirth.year ?? "??"}`
                break;
            case 'anime':
            message = `😎 *ANIME ENCONTRADO* 🔎
  ${extraMessage}
  *Título*: ${formatText(animeData.title.romaji ?? "Não Encontrado.")}
  *Título Original*: ${formatText(animeData.title.native ?? "Não Encontrado.")}
  
  *Descrição*: ${!animeData.description ? "Não Encontrado." : await translate(formatText(animeData.description), 'pt')}

  *Lançamento*: ${animeData.startDate.day ?? "??"}/${animeData.startDate.month ?? "??"}/${animeData.startDate.year ?? "??"}
  *Ultima Atualização*: ${animeData.endDate.day ?? "??"}/${animeData.endDate.month ?? "??"}/${animeData.endDate.year ?? "??"}
  *Episódios*: ${animeData.episodes ?? "Não Encontrado."}
  *Capítulos*: ${animeData.chapters ?? (animeData.volumes ?? "Sem Informações")}

  *Generos*: ${animeData.genres.join(", ") ?? "Nenhum 🤔"}

  *Pontuação*: ${animeData.averageScore ?? "??"}/100`;
        }
        
    }
    

    await await socket.sendMessage(remoteJid,
        {
            image: { url: imageUrl },
            caption: message,
        })

}