import { general } from "../configurations/general";
import { IBotData } from "../interfaces/IBotData";

import { isAdmin } from "../functions";

export default async (botData: IBotData) => {
  const { reply, args, remoteJid, socket, userJid, webMessage } = botData;

  if (!(await isAdmin(botData)) && !(general.owners.includes(userJid))) {
    return reply("Somente admins podem utilizar esse comando!");
  }

  if(args.length <= 0) {
    return reply("Defina uma menssagem!");
  }

  let groupData = await socket.groupMetadata(remoteJid);
  let members = groupData['participants'];

  await socket.sendMessage(remoteJid, { text: args.join(" "), mentions: members.map(member => member.id)}, { quoted: webMessage });
}