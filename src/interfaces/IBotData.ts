import { proto } from "@adiwajshing/baileys";

export interface IBotData {
  sendText: (text: string) => Promise<proto.WebMessageInfo>;
  sendImage: (
    pathOrBuffer: string | Buffer,
    caption?: string,
    isReply?: boolean
  ) => Promise<proto.WebMessageInfo>;
  sendSticker: (
    pathOrBuffer: string | Buffer,
    isReply?: boolean
  ) => Promise<proto.WebMessageInfo>;
  sendAudio: (
    pathOrBuffer: string | Buffer,
    isReply?: boolean,
    ptt?: boolean
  ) => Promise<proto.WebMessageInfo>;
  reply: (text: string) => Promise<proto.WebMessageInfo>;
  socket: any;
  remoteJid: string;
  replyJid: string;
  userJid: string;
  webMessage: proto.IWebMessageInfo;
  isImage: boolean;
  isVideo: boolean;
  isSticker: boolean;
  isAudio: boolean;
  isDocument: boolean;
  command: string;
  args: any;
}
