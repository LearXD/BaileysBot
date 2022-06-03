import path from "path";
import { connect } from "./connection";
import {
  getBotData,
  getCommand,
  getConfig,
  isCommand,
  onlyNumbers
} from "./botManager";

import { useCommand, canUseCommand } from './commandManager';

export default async () => {
  const socket = await connect();

  socket.ev.on("messages.upsert", async (message) => {
    const [webMessage] = message.messages;
    const { command, ...data } = getBotData(socket, webMessage);


    if (data.isAudio) return; //TODO: AUDIO VERIFY
    if (!isCommand(command)) return;

    if(!canUseCommand(data.remoteJid))
      return await data.reply('🕙 Aguarde 5s para executar um comando novamente!')

    try {

      await socket.sendReadReceipt(data.remoteJid, data.isGroup ? data.userJid : undefined, [ data.id ])
      const action = await getCommand(command.replace(getConfig().prefix, ""));
      useCommand(data.remoteJid)
      await action({ command, ...data });
    
    } catch (error) {
      console.log(error);
      if (error) {
        await data.reply(error.message);
      }
    }
  });

  socket.ev.on("call", async (data) => {
    data.forEach(async ({ from }) => {
      await socket.sendMessage(from, {
        text: "📵 Seu numero foi blockeado por tentar ligar para mim!"
      })
      await socket.updateBlockStatus(from, "block");
    });
  })

  socket.ev.on("group-participants.update", async ({ id, action, participants }) => {
    const groupMetadata = await socket.groupMetadata(id);

    let url: string = path.join('../assets', 'images', 'profile.jpg');
    try {
      url = (await socket.profilePictureUrl(id, "image"));
    } catch (error) { }


    switch (action) {
      case "add":
        await socket.sendMessage(participants[0], { image: { url: url }, caption: `
      👍 Seja Bem-Vindo(a) ao _${groupMetadata.subject}_

      Descrição: ${groupMetadata.desc ?? "Sem descrição..."}
      Bate papo disponível: ${groupMetadata.announce ? "Não" : "Sim"}
        
      Dono do grupo: wa.me/${onlyNumbers(groupMetadata.owner)}

        `});
        break;
      case "remove":
        //await sendImage(buffer.result, "👍 Tchau Tchau!");
        break;
    }
  });
};
