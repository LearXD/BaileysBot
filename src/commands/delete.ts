import { getPermissionLevel } from "../botManager";
import { IBotProperties } from '../interfaces';

export default async ({webMessage, remoteJid, socket, reply, quotedMessage, args, userJid}: IBotProperties) => {

    if (getPermissionLevel(userJid) < 2) return reply("Apenas owners podem utilizar este comando!")

    if(!quotedMessage && args.length < 2) {
        return reply("🙄 Maque uma menssagem minha para isso!")
    }

    if(quotedMessage) {
        await socket.sendMessage(remoteJid, { 
            delete: {
              id: webMessage.message.extendedTextMessage.contextInfo.stanzaId,
              participant: webMessage.message.extendedTextMessage.contextInfo.participant
          }})
    } else {
        await socket.sendMessage(args[1], { 
            delete: {
              id: args[0],
              participant: args[2]
          }})
    }

    
}