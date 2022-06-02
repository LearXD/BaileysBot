import { IBotProperties } from '../interfaces';

import { isAdmin, onlyNumbers } from "../botManager";

export const desciption = {
  usage: `add (numero)`,
  desciption: `Adicione pessoas no grupo.`
}

export default async (botData: IBotProperties) => {
  const { reply, sendText, remoteJid, socket, args } = botData;

  if (!(await isAdmin(botData))) {
    return reply("👮‍♀️ Somente admins!");
  }

  if(args.length < 1) {
    return await reply("👮‍♀️ Digite o numero de quem deseja adicionar!")
    }

  try {
    await socket.groupParticipantsUpdate(
      remoteJid,
      [onlyNumbers(args.join(" ")) + "@s.whatsapp.net"],
      "add"
    );

    await sendText("✅ Número adicionado com sucesso!");
  } catch (error) {
    console.log(error);
    await sendText("❌ Erro ao adicionar o usuário!");
  }
};
