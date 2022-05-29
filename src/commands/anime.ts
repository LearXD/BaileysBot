import { IBotData } from "../interfaces/IBotData";
import axios from "axios";
import util from 'util'
import { getBuffer } from "../functions";


export default async ({ sendImage, args, reply, socket, remoteJid }: IBotData) => {

    if (args.length <= 0) {
        return await reply("Defina o nome de um anime!")
    }

    let url = 'https://api.aniapi.com/v1/anime?title=' + args.join(" ")

    if(args[0] === "random") {
        url = 'https://api.aniapi.com/v1/random/anime/1/true'
    }

    const res = await axios.get(url, {
        headers: {
            //'Authorization': 'Bearer YOUR_JWT_KEY',
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    })

    if (res.data.status_code !== 200) {
        return await reply(`Nenhum anime foi encontrado com o nome *${args.join(" ")}*!`)
    }

    const animeData = res.data.data.documents ? res.data.data.documents[0] : res.data.data[0];
    let message = `🔎 *ANIME ENCONTRADO*
  
  *Nome*: ${animeData.titles.en.replace(/<[^>]*>?/gm, '')}
  
  *Descrição*: ${animeData.descriptions.en.replace(/<[^>]*>?/gm, '')}

  *Lançamento*: ${animeData.start_date}
  *Ultima Atualização*: ${animeData.end_date}
  *Episódios*: ${animeData.episodes_count}

  *Pontuação*: ${animeData.score}`;

    const image = (await getBuffer(animeData.cover_image)).result;


    await await socket.sendMessage(remoteJid,
        {
            image,
            caption: message,
            footer: 'Consulta por BaileysBot',
        })


}
