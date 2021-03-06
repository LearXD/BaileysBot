import fs from "fs";
import path from "path";
import axios from "axios";
import yts from "yt-search";
import ytdl from "ytdl-core";

import { IBotProperties } from '../interfaces';
import { getRandomName } from "../botManager";

export const desciption = {
    usage: `ytd (nome do video ou link)`,
    desciption: `Receba o download do video no youtube!`
  }


export default async ({ reply, sendImage, sendVideo, args }: IBotProperties) => {
    await reply("Aguarde... Pesquisando... ⌛");

    const maxLength = 100;

    if(args.length < 1) {
        return await reply(desciption.desciption)
    }

    if (!args.join(" ") || args.join(" ").length > 100) {
        return await reply(`⚠ Limite de ${maxLength} caracteres por pesquisa!`);
    }

    const result = await yts(args.join(" "));

    if (!result || !result.videos.length) {
        return await reply(`⚠ Nenhum vídeo encontrado!`);
    }

    const video = result.videos[0];

    const response = await axios.get(video.image, {
        responseType: "arraybuffer",
    });

    const buffer = Buffer.from(response.data, "utf-8");

    let dateText = "";

    if (video.ago) {
        dateText = `\n*Data*: ${video.ago
            .replace("ago", "atrás")
            .replace("years", "anos")
            .replace("months", "meses")}`;
    }

    await sendImage(
        buffer,
        `Dados encontrados
  
*Título*: ${video.title}

*Descrição*: ${video.description}

*Duração*: ${video.timestamp}${dateText}
*Views*: ${video.views}

Realizando download... ⌛`
    );

    if(
        video.timestamp.split(":").length >= 3 || 
        (video.timestamp.split(":").length === 2 && video.timestamp.split(":")[0] > 10
    )) 
        return reply("⚠ O video excede o limite de *5 minutos*!")

    const tempFile = path.resolve(
        __dirname,
        "..",
        "..",
        "assets",
        "temp",
        getRandomName("mp4")
    );

    try {
        ytdl(video.url, {
            quality: 'highest',
        })
            .pipe(fs.createWriteStream(tempFile))
            .on("finish", async () => {
                await sendVideo(tempFile);
                fs.unlinkSync(tempFile);
            });
    } catch (error) {
        throw error;
    }
    
};
