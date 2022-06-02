import { IBotProperties } from '../interfaces';

import fs from 'fs';
import { protos } from '@google-cloud/vision';

import { downloadImage, getRandomName } from "../botManager";
import { query } from '../visionManager';

export const desciption = {
    usage: `scan (imagem)`,
    desciption: `Receba informações da imagem`
}

export default async ({ reply, isImage, webMessage, socket, remoteJid }: IBotProperties) => {

    if (!isImage) {
        return await reply("⚠ Por favor, envie uma imagem!");
    }

    const imagePath = await downloadImage(webMessage, getRandomName());

    await reply("🔎 PROCESSANDO IMAGEM...")

    const res = await query(imagePath, "ADULT_DETECTION");
    fs.unlinkSync(imagePath)

    if (Object.values(res.safeSearchAnnotation).length < 1) {
        return await reply("😴 Nenhuma informação obtida!")
    }

    const getProbability = (type: any) => parseInt(protos.google.cloud.vision.v1?.Likelihood[type]);

    /*const ODDS = {
        UNKNOWN: "Desconhecido",
        VERY_UNLIKELY: "Bem Improvovável",
        UNLIKELY: "Improvavel",
        POSSIBLE: "Possivelmente",
        LIKELY: "Provavelmente",
        VERY_LIKELY: "Muito Provavelmente"
    }*/

    const ODDS = {
        UNKNOWN: "❓",
        VERY_UNLIKELY: "❌",
        UNLIKELY: "❌",
        POSSIBLE: "✔️",
        LIKELY: "✔️",
        VERY_LIKELY: "✔️"
    }

    const { adult, spoof, medical, racy, violence } = res.safeSearchAnnotation;

    let message = `
🔎 *ANÁLISE REALIZADA COM SUCESSO* 🔎

`;

    getProbability(adult) > 2 && (message += `  🔞 Conteudo +18: ${ODDS[adult]}\n`);
    getProbability(racy) > 2 && (message += `   👙 Conteúdo Explicito: ${ODDS[racy]}\n`);
    getProbability(spoof) > 2 && (message += `  👺 Conteúdo Enganoso: ${ODDS[spoof]}\n`);
    getProbability(medical) > 2 && (message += `    🩸 Conteudo Médico: ${ODDS[medical]}\n`);
    getProbability(violence) > 2 && (message += `   🔫 Conteudo Violento: ${ODDS[violence]}\n`);

    await reply(message);
}