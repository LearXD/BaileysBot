import { general } from "../configurations/general";
import { IBotData } from "../interfaces/IBotData";

import { isAdmin } from "../functions";

export default async (botData: IBotData) => {
  const { reply, remoteJid, socket, userJid } = botData;

  if (!(await isAdmin(botData)) && !(general.owners.includes(userJid))) {
    return reply("Somente admins!");
  }

  const { participants } = await socket.groupMetadata(remoteJid);
  const jids = participants.map(({ id }) => id);

  const message = jids.reduce(
    (acc: string, curr: string) => acc + `- @${curr.split("@")[0]}\n`,
    ""
  );

  await socket.sendMessage(remoteJid, {
    text: message,
    mentions: jids,
  });
};
