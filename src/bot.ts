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

  await socket.sendMessage("120363023474297101@g.us", { text: "TESTEEEEE", }, {  });

  socket.ev.on("messages.upsert", async (message) => {
    const [webMessage] = message.messages;
    const { command, ...data } = getBotData(socket, webMessage);

    if (!isCommand(command)) return;

    try {
      const action = await getCommand(command.replace(general.prefix, ""));
      await action({ command, ...data });
    } catch (error) {
      console.log(error);
      if (error) {
        await data.reply(`Erro: ${error.message}`);
      }
    }
  });

  socket.ev.on("group-participants.update", async (data) => {
    const { id, action, participants } = data;
    const { sendImage } = getBotFunctions(socket, id);

    const image = await socket.profilePictureUrl(participants[0], "image");
    const buffer = await getBuffer(image);

    switch (action) {
      case "add":
        await sendImage(buffer.result, "👍 Seja Bem-Vindo ao Grupo!");
        break;
      case "remove":
        await sendImage(buffer.result, "👍 Tchau Tchau!");
        break;
    }
  });
};
