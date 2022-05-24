import makeWASocket, { DisconnectReason, useSingleFileAuthState } from "@adiwajshing/baileys";
import { Boom } from "@hapi/boom";
import pm from 'path';

export const connect = async () => {
	const {state, saveState} = useSingleFileAuthState(
		pm.resolve(__dirname, "..", "cache", "auth_info_multi.json")
	)
	
	const socket = makeWASocket({
		printQRInTerminal: true,
		auth: state,
	});
	
	socket.ev.on("connection.update", async (update) => {
		const { connection, lastDisconnect } = update;
		
		if( connection === "close") {
			const shoudReconnect = (lastDisconnect?.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut;
			
			if(shoudReconnect) {
				await connect();
			}
		}
		
	});
	
	socket.ev.on("creds.update", saveState);
	
	return socket;
}