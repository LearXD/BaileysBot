import { getPermissionLevel } from "./botManager";

const userData = [];

export const canUseCommand = (jid: string) => 
    getPermissionLevel(jid) > 0 || !userData.includes(jid);

export const useCommand = (jid: string, command?: string) => {
    if(getPermissionLevel(jid) <= 0) {
        userData.push(jid);
    }
}