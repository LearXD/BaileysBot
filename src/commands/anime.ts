import path from 'path';

import { downloadImage, getRandomName } from "../functions";
import { IBotData } from "../interfaces/IBotData";

import fs from "fs";
import fetch from "node-fetch";

import util from 'util';

export const desciption = {
    usage: `anime (marque ou envie uma imagem)`,
    desciption: `Descubra o anime e episódio através de uma imagem!`
  }

export default async ({ socket, reply, isImage, webMessage, remoteJid }: IBotData) => {

    if (!isImage) {
        return await reply("⚠ Por favor, envie uma imagem!");
    }

    const downloadPath = path.resolve(
        __dirname,
        "..",
        "..",
        "assets",
        "temp"
    );

    const imagePath = await downloadImage(webMessage, getRandomName(), downloadPath);
    await reply("🔎 Fazendo busca!")

    const res = JSON.parse(await (await fetch("https://api.trace.moe/search", {
        method: "POST",
        body: fs.readFileSync(imagePath),
        headers: { "Content-type": "image/jpeg" },
    })).text());
    console.log(util.inspect(res, {showHidden: false, depth: null, colors: true}))

    fs.unlinkSync(imagePath)

    if(res.error !== "") {
        return await reply("✖ Um erro ocorreu ao procurar o anime!\nErro: " + res.error) 
    }

    const anime = res.result[0];

    const text = `🔎 *ANIME ENCONTRADO*

    🔥 Frames analizados: ${res.frameCount}

    Anime: ${anime.filename.split(".mp4")[0]}
    Frames: ${anime.from} --> ${anime.to}
    Similaridade: ${Math.round(anime.similarity * 100)}%

    OBS: Resultados de menos que 80% possuem a chance de serem incorretos!

    Seach by BaileysBot 😎
    `
    

    await socket.sendMessage(remoteJid, {
        video: { url: anime.video },
        caption: text,
        gifPlayback: true
    })
}