import { getConfig } from '../botManager';
import { IBotProperties } from '../interfaces';

export const desciption = {
  usage: `fakequote (numero) (menssagem)`,
  desciption: `Faça uma resposta falsa com o numero de alguem.`
}

export default async (botData: IBotProperties) => {
  const { args, reply, remoteJid, socket, userJid, webMessage, isImage} = botData;

  if(args.length <= 1) {
    return reply(`Use: ${getConfig().prefix}fakequote (numero) (menssagem fake)`);
  }

    const address = args.shift() + "@s.whatsapp.net";

    let fakeWebMessage = {
      key: {
        participant: address,
        remoteJid: webMessage.key.remoteJid,
        fromMe: false,
        id: "FAKEID" + Math.floor(Math.random() * 10000),
      },
      message: {
        extendedTextMessage: {
          text: args.join(" ")
        }
      }
      
  }
  
  //args.shift();
  //fakeWebMessage.message.extendedTextMessage.text = args.join(" ")

  await socket.sendMessage(remoteJid, {
       text: ".",
    }, { quoted: fakeWebMessage });
}