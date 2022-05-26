import fs from "fs";
import path from "path";

import ffmpeg from "fluent-ffmpeg";

import { IBotData } from "../interfaces/IBotData";

import { downloadImage, downloadVideo, getRandomName } from "../functions";

export default async ({
  isImage,
  isVideo,
  webMessage,
  reply,
  sendSticker }: IBotData) => {

  if (!isImage && !isVideo) {
    return await reply(`⚠ Por favor, envie uma imagem ou um vídeo!`);
  }

  await reply("Aguarde... Gerando figurinha... ⌛");

  const resultPath = path.resolve(
    __dirname,
    "..",
    "..",
    "assets",
    "temp",
    getRandomName("webp")
  );

  if (isImage) {
    const imagePath = await downloadImage(webMessage, getRandomName());

    ffmpeg(imagePath)
      .input(imagePath)
      .on("error", async (error: any) => {
        console.log(error);
        await reply(
          "❌ Ocorreu um erro ao gerar o seu sticker! Tente novamente mais tarde!"
        );
        fs.unlinkSync(imagePath);
      })
      .on("end", async () => {
        await sendSticker(resultPath);
        fs.unlinkSync(imagePath);
        fs.unlinkSync(resultPath);
      })
      .addOutputOptions([
        `-vcodec`,
        `libwebp`,
        `-vf`,
        `scale='min(200,iw)':min'(200,ih)':force_original_aspect_ratio=decrease,fps=15, pad=200:200:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse`,
      ])
      .toFormat("webp")
      .save(resultPath);
  } else {
    const videoPath = await downloadVideo(webMessage, getRandomName());

    const sizeSeconds = 10;

    const isOKSecondsRules =
      (isVideo && webMessage?.message?.videoMessage?.seconds <= sizeSeconds) ||
      (isVideo &&
        webMessage?.message?.extendedTextMessage?.contextInfo?.quotedMessage
          ?.videoMessage?.seconds <= sizeSeconds);

    if (!isOKSecondsRules) {
      fs.unlinkSync(videoPath);

      await reply(
        `⚠ Esse vídeo tem mais de ${sizeSeconds} segundos ... Diminui ai!`
      );
    }

    ffmpeg(videoPath)
      .on("error", async (error) => {
        console.log(error);
        await reply(
          "❌ Ocorreu um erro ao gerar o seu sticker! Tente novamente mais tarde!"
        );
        fs.unlinkSync(videoPath);
      })
      .on("end", async () => {
        await sendSticker(resultPath);

        fs.unlinkSync(videoPath);
        fs.unlinkSync(resultPath);
      })
      .addOutputOptions([
        `-vcodec`,
        `libwebp`,
        `-vf`,
        `scale='min(200,iw)':min'(200,ih)':force_original_aspect_ratio=decrease,fps=30, pad=200:200:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse`,
      ])
      .toFormat("webp")
      .save(resultPath);
  }
};
