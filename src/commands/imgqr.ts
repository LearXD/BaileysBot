import { IBotData } from "../interfaces/IBotData";
import qrcode from 'qrcode'

import fs from 'fs';
import { downloadImage, getRandomName } from "../functions";

import imageToBase64 from 'image-to-base64';

import util from 'util';

export const desciption = {
    usage: `imgqr (imagem)`,
    desciption: `Receba informações da imagem`
}

export default async ({ reply, isImage, webMessage, sendImage }: IBotData) => {

    if (!isImage) {
        return await reply(`⚠ Por favor, envie uma imagem!`);
      }

    const content = webMessage?.message?.imageMessage ||
        webMessage?.message?.extendedTextMessage?.contextInfo?.quotedMessage
          ?.imageMessage;
    
    await reply("⏳ Transformando em QrCode...")

    const qr = await qrcode.toDataURL(content)
    const buffer = Buffer.from(qr, 'base64')
    
    await sendImage(buffer);
}