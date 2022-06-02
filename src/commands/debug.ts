import { IBotProperties } from '../interfaces';
import fs from 'fs';
import path from 'path'

export default async ({ webMessage, socket, remoteJid, sendText }: IBotProperties) => {
    console.log(require('util').inspect(webMessage, { showHidden: false, depth: null, colors: true }))
}