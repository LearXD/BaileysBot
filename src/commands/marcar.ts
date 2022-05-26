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
  let jids = [];

  members.map(async contatct => { jids.push(contatct.id.replace('c.us', 's.whatsapp.net')) })

  await socket.sendMessage(remoteJid, { text: args.join(" "), contextInfo: {mentionedJid: jids}, quoted: webMessage });
}