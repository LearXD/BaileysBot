import path from 'path';
import fs from 'fs';

import { IBotData } from "../interfaces/IBotData";
import { getPermissionLevel, getRandomName } from "../functions";

import * as tts from 'google-tts-api';


export default async ({ socket, args, sendAudio, reply }: IBotData) => {

  if (args.length < 1) {
    return await reply("⚠ Defina o codigo da linguagem que deseja que seja falado!")
  }

  if (args.length < 2) {
    return await reply("⚠ Defina a menssagem que deseja que seja falado!")
  }

  const lang = args.shift();

  try {
    const audioPath = path.join(__dirname, '..', '..', 'assets', 'temp', getRandomName(".mp3"));
    const audio = await tts.getAudioBase64(args.join(" "), {
      lang: lang,
      slow: false,
      host: 'https://translate.google.com',
      timeout: 10000,
    })

    const buffer = Buffer.from(audio, 'base64');
    fs.writeFileSync(audioPath, buffer);

    await sendAudio(audioPath, true, true)
    fs.unlinkSync(audioPath);
  } catch (error) {
    return await reply("⚠ Não foi possivel fazer o audio!\nUse: ")
  }
}