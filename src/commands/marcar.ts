import { general } from "../configurations/general";
import { IBotData } from "../interfaces/IBotData";

import { getPermissionLevel } from "../functions";

export default async (botData: IBotData) => {
  const { reply, args, remoteJid, socket, userJid, webMessage } = botData;

  if(getPermissionLevel(userJid) < 2) return reply("Apenas owners podem utilizar este comando!")

  if(args.length <= 0) {
    return reply("Defina uma menssagem!");
  }

  let groupData = await socket.groupMetadata(remoteJid);
  let members = groupData['participants'];

  await socket.sendMessage(remoteJid, { text: args.join(" "), mentions: members.map(member => member.id)}, { quoted: webMessage });
}