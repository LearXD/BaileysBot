import { getPermissionLevel, readJSON, writeJSON } from "./botManager";
import path from 'path';

const usersPath = path.join(__dirname, '..', 'assets', 'temp', 'users.json')

const getUserData = () => {
    return readJSON(usersPath)
}

export const canUseCommand = (jid: string) =>
    getPermissionLevel(jid) > 0 || !((getUserData()).includes(jid));

export const useCommand = (jid: string, command?: string) => {
    if (getPermissionLevel(jid) <= 0) {
        const userData = getUserData();
        userData.push(jid);
        writeJSON(usersPath, userData);
        setInterval(() => {
            const userData = getUserData();
            userData.splice(userData.indexOf(jid))
            writeJSON(usersPath, userData);
        }, 5000)
    }
}