import path from "path";
import { connect } from "./connection";
import {
  downloadAudio,
  getBotData,
  getCommand,
  getConfig,
  getRandomName,
  isCommand,
  onlyNumbers
} from "./botManager";

import fs from 'fs'

import { useCommand, canUseCommand } from './commandManager';
import { toText } from "./libs/speechManager";

export default async () => {
  const socket = await connect();

  socket.ev.on("messages.upsert", async (message) => {
    const [webMessage] = message.messages;
    const { command, ...data } = getBotData(socket, webMessage);


    if (data.isAudio) {
      //const audioPath = await downloadAudio(webMessage, getRandomName());
      //await toText(audioPath, async (result: string) => {
      //  fs.unlinkSync(audioPath);
      //  data.reply(result)
      //});
      //console.log(webMessage)
      return;
    }
    if (!isCommand(command)) return;

    if (!canUseCommand(data.remoteJid))
      return await data.reply('🕙 Aguarde 5s para executar um comando novamente!')

    try {

      await socket.sendReadReceipt(data.remoteJid, data.isGroup ? data.userJid : undefined, [data.id])
      await socket.sendPresenceUpdate('composing', data.remoteJid)
      const action = await getCommand(command.replace(getConfig().prefix, ""));
      useCommand(data.remoteJid)
      await action({ command, ...data });
      await socket.sendPresenceUpdate('available', data.remoteJid)

    } catch (error) {
      console.log(error);
      if (error) {
        await data.reply(error.message);
      }
    }
  });

  socket.ev.on("call", async (data) => {
    console.log(data)
    /*
    data.forEach(async ({ from }) => {
      await socket.sendMessage(from, {
        text: "📵 Seu numero foi blockeado por tentar ligar para mim!"
      })
      await socket.updateBlockStatus(from, "block");
    });*/
  })

  socket.ev.on("group-participants.update", async ({ id, action, participants }) => {
    const groupMetadata = await socket.groupMetadata(id);


    let url: string = path.join('../assets', 'images', 'profile.jpg');
    try {
      url = (await socket.profilePictureUrl(id, "image"));
    } catch (error) { }


    switch (action) {
      case "add":
        await socket.sendMessage(participants[0], {
          image: { url: url }, caption: `
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
