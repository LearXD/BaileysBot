import { IBotData } from "../interfaces/IBotData";
import fs from 'fs';
import path from 'path'

export default async ({ webMessage, socket, remoteJid, sendText }: IBotData) => {


    /*
    let fakeWebMessage = webMessage;
    fakeWebMessage.message.imageMessage = {
        url: 'https://units.arma3.com/groups/img/38647/xoQ4ZboeeI.png'
    }*/

    /*
    console.log(require('util').inspect(webMessage, { showHidden: false, depth: null, colors: true }))

    const imagePath = path.join(__dirname, '..', '..', 'assets', 'images', 'profile.jpg')

    await socket.sendMessage(remoteJid, {
        text: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
        linkPreview: {
            'canonical-url': 'https://github.com/LearXD/BaileysBot',
            'matched-text': 'https://github.com/LearXD/BaileysBot',
            title: "BaileysBot by LearXD",
            description: "Clique para ver meu repositorio!",
        }
    })*/
}