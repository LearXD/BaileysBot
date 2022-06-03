import { IBotProperties } from '../interfaces';
import fs from 'fs';
import path from 'path'
import { getRandomName } from '../botManager';

export default async ({ webMessage, socket, remoteJid, sendText, id }: IBotProperties) => {

    console.log(require('util').inspect(webMessage, { showHidden: false, depth: null, colors: true }))

    const a = await socket.relayMessage(remoteJid, {
        paymentInviteMessage: {
            serviceType: 3,
            expiryTimestamp: 1
        }
    }, {
    })



}


