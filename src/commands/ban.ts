import { isJidGroup } from "@adiwajshing/baileys";
import { IBotProperties } from '../interfaces';
import { isAdmin } from '../botManager';

export const desciption = {
    usage: `ban (pessoas)`,
    desciption: `Remova pessoas do grupo.`
  }

export default async (botData: IBotProperties) => {

    const {socket, reply, userJid, remoteJid, mentionedJid, webMessage } = botData;

    if(!isJidGroup(remoteJid)) {
        return await reply("⛔ Você só pode utilizar esse comando em grupos!")
    }

    if(!isAdmin(botData)) {
        return await reply("👮‍♀️ Você precisa ser um administrador para executar este comando!")
    }

    if(mentionedJid.length < 1) {
        return await reply("👮‍♀️ Marque alguem que você deseja remover!")
    }

    await reply("👮‍♀️ Removendo participantes!");

    mentionedJid.forEach(async (jid) => {
        try {
            await socket.groupParticipantsUpdate(
                remoteJid, 
                [ jid ],
                "remove"
            )
        } catch(error) {
            await reply("❌ Erro ao adicionar o usuário!")
        }
        
    })
    
}