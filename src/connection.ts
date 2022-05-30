import pm from 'path';

import makeWASocket, { DisconnectReason, useMultiFileAuthState } from "@adiwajshing/baileys";
import { Boom } from "@hapi/boom";

import Logger from "pino"

export const connect = async () => {
	const { state, saveCreds } = await useMultiFileAuthState(pm.resolve(__dirname, "..", "settings", "auth"))

	const socket = makeWASocket({ printQRInTerminal: true, auth: state, logger: Logger({ level: 'silent' }) });
	
	socket.ev.on("connection.update", async (update) => {
		const { connection, lastDisconnect } = update;
		if( connection === "close") {
			const shoudReconnect = (lastDisconnect?.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut;
			if(shoudReconnect) {
				await connect();
			}
		}
		
	});
	socket.ev.on("creds.update", saveCreds);
	return socket;
}