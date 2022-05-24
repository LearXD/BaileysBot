import { proto } from "@adiwajshing/baileys";

export interface IBotData {
    sendText: (text: string) => Promise<proto.WebMessageInfo>;
    sendImage: (pathOrBuffer: string | Buffer, caption?: string, isReply?: boolean) => Promise<proto.WebMessageInfo>;
    sendSticker: (pathOrBuffer: string | Buffer, isReply?: boolean) => Promise<proto.WebMessageInfo>;
    sendAudio: (pathOrBuffer: string | Buffer, ptt?: boolean, isReply?: boolean) => Promise<proto.WebMessageInfo>;
    reply: (text: string) => Promise<proto.WebMessageInfo>;
    socket: any;
    remoteJid: string;
    replyJid: string;
    webMessage: proto.IWebMessageInfo;
    isImage: boolean;
    userJid: string;
    isSticker: boolean;
    isAudio: boolean;
    isVideo: boolean;
    isDocument: boolean;
    command: string;
    args: string;
}