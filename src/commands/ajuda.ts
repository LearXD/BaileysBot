import path from 'path';
import fs from 'fs';

import { general } from '../configurations/general';
import { IBotData } from "../interfaces/IBotData";

export default async ({socket, reply, remoteJid}: IBotData) => {
    const commandsPath = path.join(__dirname);

    const commands = fs
      .readdirSync(commandsPath)
      .map((filename) => { return `${filename.split(".")[0]}: [{desrição}]`});

    if(commands.length <= 0) return reply("⚠ Não há nenhum comando disponível!");

    let text = `📝 Lista de comandos (${commands.length}) 📝\n`; 
    commands.map((command, pos) => {
        text += `\n- ${general.prefix}${command}`;
    })

    await socket.sendMessage(remoteJid, { 
      text: text,
      footer: '~ Bot by LearXD',
      templateButtons: [
        {index: 1, urlButton: {displayText: 'Meu dono 😎', url: 'https://learxd.tk'}}
      ]
    })
};
