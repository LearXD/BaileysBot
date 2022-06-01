import { proto } from "@adiwajshing/baileys";
import { ISocket } from "./ISocket";

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
  sendVideo: (
    pathOrBuffer: string | Buffer,
    caption?: string,
    isReply?: boolean,
    gifPlayback?: boolean
  ) => Promise<proto.WebMessageInfo>;
  reply: (text: string) => Promise<proto.WebMessageInfo>;
  socket?: ISocket;
  id?: string;
  remoteJid?: string;
  replyJid?: string;
  userJid?: string;
  quotedMessage?: any;
  webMessage?: proto.IWebMessageInfo;
  isImage?: boolean;
  isVideo?: boolean;
  isSticker?: boolean;
  isAudio?: boolean;
  isDocument?: boolean;
  command?: string;
  mentionedJid?: any;
  buttonsResponseMessage?: proto.IButtonsResponseMessage|null;
  args?: any;
}
