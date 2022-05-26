import path from 'path';
import { general } from '../configurations/general';
import { getBotData, readJSON } from "../functions";
import { IBotData } from "../interfaces/IBotData";

export default async (botData: IBotData) => {
    const { reply } = botData;
    const commandsPath = path.join(__dirname, "..", "..", "cache", "commands.json");
    const commands = readJSON(commandsPath);

    if(commands.length <= 0) return reply("⚠ Não há nenhum comando disponível!");

    let text = `📝 Lista de comandos (${commands.length}) 📝\n`; 
    commands.map((command, pos) => {
        text += `\n- ${general.prefix}${command}`;
    })
    reply(text);
};
