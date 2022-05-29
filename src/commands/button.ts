import { IBotData } from "../interfaces/IBotData";

export default async (botData: IBotData) => {

    const { args, socket, remoteJid} = botData;

    if(!(args[0] || args[1] || args[2] || args[3])) return;

    await socket.sendMessage(remoteJid, {
        text: args[0],
        footer: args[1],
        templateButtons: [
            {index: 1, urlButton: {displayText: args[2], url: args[3]}},
    ]
    })
};
