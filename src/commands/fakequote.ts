import { general } from "../configurations/general";
import { IBotData } from "../interfaces/IBotData";
import { WATextMessage } from "@adiwajshing/baileys";
import util from 'util'

import { isAdmin, getRandomName } from "../functions";

export default async (botData: IBotData) => {
  const { args, reply, remoteJid, socket, userJid, webMessage } = botData;

  if (!(general.owners.includes(userJid))) {
    return reply("Apenas meu dono pode utilizar este comando :D");
  }

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

  //console.log(util.inspect(webMessage, {showHidden: false, depth: null, colors: true}))
  await socket.sendMessage(remoteJid, {
       text: ".",
    }, { quoted: fakeWebMessage });
}