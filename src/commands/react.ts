import { IBotProperties } from '../interfaces';

export const desciption = {
  usage: `react (emoji)`,
  desciption: `Faça-me reagir à uma menssagem.`
}


export default async (botData: IBotProperties) => {
  const { args, reply, remoteJid, socket, userJid, webMessage } = botData;

  if(!args || args.length < 1 || (args[0].length < 1 || args[0].length > 3)) {
    return reply("Defina uma reação utilizando emojis");
  }

  let key = null;

  if(webMessage.message.extendedTextMessage?.contextInfo.quotedMessage) {
      key = {
          remoteJid: webMessage.key.remoteJid,
          fromMe: false,
          id: webMessage.message.extendedTextMessage.contextInfo.stanzaId,
          participant: webMessage.message.extendedTextMessage.contextInfo.participant
      }
  }

  await socket.sendMessage(remoteJid, {
       react: {
          text: args[0],
          key: key ?? webMessage.key
        }
    });
}