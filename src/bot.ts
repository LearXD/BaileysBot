import { general } from "./configurations/general";
import { connect } from "./connection";
import {
  getBotData,
  getBuffer,
  getCommand,
  isCommand,
  onlyNumbers
} from "./functions";

export default async () => {
  const socket = await connect();

  socket.ev.on("messages.upsert", async (message) => {
    const [webMessage] = message.messages;
    const { command, ...data } = getBotData(socket, webMessage);

    console.log(webMessage)

    if (data.isAudio) return;
    if (!isCommand(command)) return;

    try {

      const action = await getCommand(command.replace(general.prefix, ""));
      await action({ command, ...data });
      await socket.sendReadReceipt(data.remoteJid, data.userJid, [ data.id ])

    } catch (error) {
      console.log(error);
      if (error) {
        await data.reply(error.message);
      }
    }
  });

  socket.ev.on("call", async (data) => {
    data.forEach(async ({ from }) => {
      await socket.sendMessage(from, {
        text: "📵 Seu numero foi blockeado por tentar ligar para mim!"
      })
      await socket.updateBlockStatus(from, "block");
    });
  })

  socket.ev.on("group-participants.update", async ({ id, action, participants }) => {
    const groupMetadata = await socket.groupMetadata(id);

    

    let url = "https://kanto.legiaodosherois.com.br/w760-h398-gnw-cfill-q95/wp-content/uploads/2022/03/legiao_1Chpjai7RW84.jpg.jpeg";

    try {
      url = (await socket.profilePictureUrl(id, "image"));
    } catch (error) { }

    const image = await getBuffer(url);

    switch (action) {
      case "add":
        await socket.sendMessage(participants[0], { image: { url: url }, caption: `
      👍 Seja Bem-Vindo(a) ao _${groupMetadata.subject}_

      Descrição: ${groupMetadata.desc ?? "Sem descrição..."}
      Bate papo disponível: ${groupMetadata.restrict ? "Não" : "Sim"}
        
      Dono do grupo: wa.me/${onlyNumbers(groupMetadata.owner)}

        `});
        break;
      case "remove":
        //await sendImage(buffer.result, "👍 Tchau Tchau!");
        break;
    }
  });
};
