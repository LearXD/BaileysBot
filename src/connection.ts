import pm from 'path';

import makeWASocket, { DisconnectReason, useMultiFileAuthState, useSingleFileAuthState } from "@adiwajshing/baileys";
import { Boom } from "@hapi/boom";

import Logger from "pino"

export const connect = async () => {

	//TODO: Use Multi File Auth
	const { state, saveState } = useSingleFileAuthState(pm.resolve(__dirname, "..", "settings", "auth.json"))

	const socket = makeWASocket(
		{
			printQRInTerminal: true,
			auth: state,
			//logger: Logger({ level: 'silent' })
		});
	

	socket.ev.on("connection.update", async (update) => {
		const { connection, lastDisconnect } = update;
		if (connection === "close") {
			const shoudReconnect = (lastDisconnect?.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut;
			if (shoudReconnect) {
				await connect();
			}
		}

	});
	socket.ev.on("creds.update", saveState);
	return socket;
}