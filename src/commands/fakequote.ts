import { general } from "../configurations/general";
import { IBotData } from "../interfaces/IBotData";

export const desciption = {
  usage: `fakequote (numero) (menssagem)`,
  desciption: `Faça uma resposta falsa com o numero de alguem.`
}

export default async (botData: IBotData) => {
  const { args, reply, remoteJid, socket, userJid, webMessage, isImage} = botData;

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
        imageMessage: {
          url: 'https://units.arma3.com/groups/img/38647/xoQ4ZboeeI.png',
          mimetype: "image/jpeg",
          caption: 'Negão da piroca 😍',
          height: 158,
          width: 429,
          jpegThumbnail: webMessage.message.imageMessage.jpegThumbnail
        }
      }
      
  }
  
  //args.shift();
  //fakeWebMessage.message.extendedTextMessage.text = args.join(" ")

  await socket.sendMessage(remoteJid, {
       text: ".",
    }, { quoted: fakeWebMessage });
}