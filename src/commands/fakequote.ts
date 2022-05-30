import { general } from "../configurations/general";
import { IBotData } from "../interfaces/IBotData";

import { getPermissionLevel } from "../functions";

export const desciption = {
  usage: `fakequote (numero) (menssagem)`,
  desciption: `Faça uma resposta falsa com o numero de alguem`
}

export default async (botData: IBotData) => {
  const { args, reply, remoteJid, socket, userJid, webMessage } = botData;

  if(getPermissionLevel(userJid) < 1) return reply("Apenas owners podem utilizar este comando!")

  if(args.length <= 1) {
    return reply(`Use: ${general.prefix}fakequote (numero) (menssagem fake)`);
  }

  let fakeWebMessage = {
      key: {
        participant: args[0] + "@s.whatsapp.net",
        remoteJid: webMessage.key.remoteJid,
        fromMe: false,
        id: "FAKEID" + Math.floor(Math.random() * 10000),
      },
      message: {
        extendedTextMessage: {
            text: ""
        }
      }
  }

  args.shift();
  fakeWebMessage.message.extendedTextMessage.text = args.join(" ")

  await socket.sendMessage(remoteJid, {
       text: ".",
    }, { quoted: fakeWebMessage });
}