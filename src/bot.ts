import path from "path";
import { general } from "./configurations/general";
import { connect } from "./connection";
import {
  getBotData,
  getCommand,
  isCommand,
  readJSON,
} from "./functions";

export default async () => {
  const socket = await connect();

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

    if (action !== "add" || !participants.length) return;

    const [participant] = participants;

    try {
      await socket.groupParticipantsUpdate(id, [participant], "remove");
    } catch (error) {
      console.log(error);
    }
  });
};
