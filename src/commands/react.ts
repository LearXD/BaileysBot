import { IBotData } from "../interfaces/IBotData";

export default async (botData: IBotData) => {
  const { args, reply, remoteJid, socket, userJid, webMessage } = botData;

  if(!args[0] && args[0].length !== 1) {
    return reply("Defina uma reação utilizando emojis");
  }

  let key = null;

  if(webMessage.message.extendedTextMessage.contextInfo.quotedMessage) {
      key = {
          remoteJid: webMessage.key.remoteJid,
          fromMe: false,
          id: webMessage.message.extendedTextMessage.contextInfo.stanzaId,
          participant: webMessage.message.extendedTextMessage.contextInfo.participant
      }
  }

  //console.log(util.inspect(webMessage, {showHidden: false, depth: null, colors: true}))

  await socket.sendMessage(remoteJid, {
       react: {
          text: args[0],
          key: key ?? webMessage.key
        }
    });
}