import fs from "fs";
import path from "path";
import axios from "axios";
import yts from "yt-search";
import ytdl from "ytdl-core";

import { IBotProperties } from '../interfaces';
import { getRandomName } from "../botManager";

export const desciption = {
    usage: `musica (nome do video ou link)`,
    desciption: `Receba o download de uma musica no youtube!`
  }

export default async ({ reply, sendImage, sendAudio, args }: IBotProperties) => {
    await reply("Aguarde... Pesquisando... ⌛");

    const maxLength = 100;

    if(args.length < 1) {
        return await reply(desciption.desciption)
    }

    if (args.join(" ").length > 100) {
        return await reply(`⚠ Limite de ${maxLength} caracteres por pesquisa!`);
    }

    const result = await yts(args.join(" "));

    if (!result || !result.videos.length) {
        return await reply(`⚠ Nenhuma música encontrada!`);
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
        (video.timestamp.split(":").length === 2 && video.timestamp.split(":")[0] > 5
    )) 
        return reply("⚠ a musica excede o limite de *5 minutos*!")

    const tempFile = path.resolve(
        __dirname,
        "..",
        "..",
        "assets",
        "temp",
        getRandomName("mp3")
    );

    ytdl(video.url, {
        quality: 'highestaudio',
        filter: 'audioonly'
    })
        .pipe(fs.createWriteStream(tempFile))
        .on("finish", async () => {
            await sendAudio(tempFile, true, false);
            fs.unlinkSync(tempFile);
        });
};
