import { IBotProperties } from '../interfaces';
import fs from 'fs';
import path from 'path'
import { getRandomName } from '../botManager';

export default async ({ webMessage, socket, remoteJid, sendText, id }: IBotProperties) => {

    console.log(require('util').inspect(webMessage, { showHidden: false, depth: null, colors: true }))

    socket.sendMessage(remoteJid, {
        text: "Marcar"
    }, {
        quoted: {
            key: {
                remoteJid: '553171357942@s.whatsapp.net',
                fromMe: false,
                id: '0082E5A730E7B9B306A86C4DF3F9467AA',
                participant: undefined
              },
              messageTimestamp: 1654296826,
              pushName: 'MIGUEL 乡 LEARXD',
              message: {
                extendedTextMessage: {
                  text: '!debug',
                  previewType: 0,
                  contextInfo: {
                    mentionedJid: [],
                    stanzaId: 'C68F44456DD75ED94A9F87FF0EDAA7AAA',
                    participant: '1@s.whatsapp.net',
                    quotedMessage: {
                      imageMessage: {
                        interactiveAnnotations: [],
                        scanLengths: [ 12147, 32373 ],
                        url: 'https://mmg.whatsapp.net/d/f/Ahdyd13yiCNe8X2orzy4C2HyeFmhUATz_jBueaJV3S7v.enc',
                        mimetype: 'image/jpeg',
                        height: 1600,
                        width: 900,
                        directPath: '/v/t62.7118-24/31213177_529029565367353_3495615718509681732_n.enc?ccb=11-4&oh=01_AVx8ClQonRUAmOMPsJcr764zCywUpeZpF88H6Q_52oVdpw&oe=62BFC0D8'
                      }
                    },
                    remoteJid: 'status@broadcast'
                  },
                  inviteLinkGroupTypeV2: 0
                },
              }
        }
    })

    /*
    const a = await socket.relayMessage(remoteJid, {
        paymentInviteMessage: {
            serviceType: 3,
            expiryTimestamp: 1
        }
    }, {
    })*/



}


