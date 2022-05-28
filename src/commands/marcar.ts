import { general } from "../configurations/general";
import { IBotData } from "../interfaces/IBotData";

import { isAdmin } from "../functions";

export default async (botData: IBotData) => {
  const { reply, args, remoteJid, socket, userJid, webMessage } = botData;

  if (!(general.owners.includes(userJid))) {
    return reply("Apenas meu dono pode utilizar este comando :D");
  }

  if(args.length <= 0) {
    return reply("Defina uma menssagem!");
  }

  let groupData = await socket.groupMetadata(remoteJid);
  let members = groupData['participants'];

  await socket.sendMessage(remoteJid, { text: args.join(" "), mentions: members.map(member => member.id)}, { quoted: webMessage });
}