import { general } from "../configurations/general";
import { IBotData } from "../interfaces/IBotData";

import path from "path";

import { getPermissionLevel, readJSON, writeJSON } from "../functions";

export default async ({ reply, args, userJid }: IBotData) => {

  if (getPermissionLevel(userJid) < 2) {
    return await reply("⚠ Apenas um Super Usuário pode utilizar este comando!");
  }

  const ownersPath = path.join(__dirname, '..', '..', 'cache', 'owners.json');
  let ownersData = readJSON(ownersPath);

  if(args.length <= 0) {
    return await reply(`⚠ Use ${general.prefix}owner add|remove`);
  }

  if(args.length <= 1) {
    return await reply(`⚠ Defina o numero do owner que deseja adicionar!`);
  }

  switch (args[0]) {
    case "add":
        if(ownersData.owners.includes(args[1])) {
            return reply("⚠ Esse owner ja foi adicionado!")
        }
        ownersData.owners.push(args[1]);
        await reply("Adicionando owner... ⏳")
        break;
    case "remove":
        if(!ownersData.owners.includes(args[1])) {
            return await reply("⚠ Esse numero não é de um owner!")
        }

        ownersData.filter((value) => value !== args[1]);
        break;
        default:
        return await reply("⚠ Este sub-command não existe!")        
  }

  writeJSON(ownersPath, ownersData);
  return await reply("😆 Lista de Owners atualizada com sucesso!");

}