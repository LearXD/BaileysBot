import path from "path";
import { general } from "./configurations/general";
import { connect } from "./connection";
import {
  getBotData,
  getBotFunctions,
  getBuffer,
  getCommand,
  isCommand,
  readJSON,
} from "./functions";


export default async () => {
  const socket = await connect();

  socket.ev.on("messages.upsert", async (message) => {
    const [webMessage] = message.messages;
    const { command, ...data } = getBotData(socket, webMessage);

    

    if(data.isAudio) return;
    if (!isCommand(command)) return;

    
    // DEBUG: 
    // socket.sendMessage("", {image: {}}}, {quoted})

    try {

      const action = await getCommand(command.replace(general.prefix, ""));
      await socket.sendReadReceipt(data.remoteJid, data.userJid, [data.id])
      await action({ command, ...data });
      

    } catch (error) {
      console.log(error);
      if (error) {
        await data.reply(error.message);
      }
    }
  });

  socket.ev.on("call", async (data) => {
    data.forEach(async ({from}) => {
      await socket.sendMessage(from, {
        text: "📵 Seu numero foi blockeado por tentar ligar para mim!"
      })
      await socket.updateBlockStatus(from, "block");
    });
  })

  socket.ev.on("group-participants.update", async (data) => {
    const { id, action, participants } = data;
    const { sendImage } = getBotFunctions(socket, id);

    const image = await socket.profilePictureUrl(participants[0], "image");
    const buffer = await getBuffer(image);

    switch (action) {
      case "add":
        await sendImage(buffer.result, "👍 Seja Bem-Vindo(a) ao Grupo!");
        break;
      case "remove":
        await sendImage(buffer.result, "👍 Tchau Tchau!");
        break;
    }
  });
};
