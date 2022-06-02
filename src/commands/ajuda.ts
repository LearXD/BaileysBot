import path from 'path';
import fs from 'fs';

import { IBotProperties } from '../interfaces';
import { getConfig } from '../botManager';

export const desciption = {
  usage: `ajuda`,
  desciption: `Veja a lista de comandos disponíveis!`
}

export default async ({socket, reply, remoteJid}: IBotProperties) => {
    const commandsPath = path.join(__dirname);

    const commands = fs
      .readdirSync(commandsPath)
      .map((filename) => { 
        const commandData = require(path.join(commandsPath, filename));
        return commandData?.desciption ?
          `${commandData.desciption.usage} [ ${commandData.desciption.desciption} ]` :
          `${filename.split(".")[0]}`
      });

    if(commands.length <= 0) return reply("⚠ Não há nenhum comando disponível!");

    let text = `📝 *Lista de comandos* (${commands.length}) 📝\n`; 
    commands.map((command, pos) => {
        text += `\n➤ ${getConfig().prefix}${command} \n`;
    })

    await socket.sendMessage(remoteJid, { 
      text: text,
      footer: '~ Bot by LearXD',
      templateButtons: [
        {index: 1, urlButton: {displayText: 'Meu dono 😎', url: 'https://learxd.tk'}}
      ]
    })
};
