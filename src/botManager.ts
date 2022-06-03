import { proto, DownloadableMessage, downloadContentFromMessage, GroupParticipant, isJidGroup } from "@adiwajshing/baileys";
import fs from "fs";
import pm from 'path';
import { writeFile } from "fs/promises";
import { IBotProperties } from './interfaces';;
import fetch from "node-fetch";
import { path } from "@ffmpeg-installer/ffmpeg";

export const getBotFunctions = (socket: any, remoteJid: string, webMessage?: proto.IWebMessageInfo) => {

  const sendText = async (text: string) => {
    return socket.sendMessage(remoteJid, {
      "text": text,
    });
  };

  const sendImage = async (
    pathOrBuffer: string | Buffer,
    caption = "",
    isReply = true
  ) => {
    let options = {};

    if (isReply) {
      options = {
        quoted: webMessage,
      };
    }

    const image =
      pathOrBuffer instanceof Buffer
        ? pathOrBuffer
        : fs.readFileSync(pathOrBuffer);

    const params = caption
      ? {
        image,
        "caption": caption,
      }
      : { image };

    return await socket.sendMessage(remoteJid, params, options);
  };

  const sendSticker = async (pathOrBuffer: string | Buffer, isReply = true) => {
    let options = {};

    if (isReply) {
      options = {
        quoted: webMessage,
      };
    }

    const sticker =
      pathOrBuffer instanceof Buffer
        ? pathOrBuffer
        : fs.readFileSync(pathOrBuffer);

    return await socket.sendMessage(remoteJid, { sticker }, options);
  };

  const sendAudio = async (
    pathOrBuffer: string | Buffer,
    isReply = true,
    ptt = true
  ) => {
    let options = {};

    if (isReply) {
      options = {
        quoted: webMessage,
      };
    }

    const audio =
      pathOrBuffer instanceof Buffer
        ? pathOrBuffer
        : fs.readFileSync(pathOrBuffer);

    if (pathOrBuffer instanceof Buffer) {
      return await socket.sendMessage(
        remoteJid,
        {
          audio,
          ptt,
          mimetype: "audio/mpeg",
        },
        options
      );
    }

    options = { ...options, url: pathOrBuffer };

    return await socket.sendMessage(
      remoteJid,
      {
        audio: { url: pathOrBuffer },
        ptt,
        mimetype: "audio/mpeg",
      },
      options
    );
  };

  const sendVideo = async (
    pathOrBuffer: string | Buffer,
    caption = "",
    isReply = true
  ) => {
    let options = {};

    if (isReply) {
      options = {
        quoted: webMessage,
      };
    }

    const video =
      pathOrBuffer instanceof Buffer
        ? pathOrBuffer
        : fs.readFileSync(pathOrBuffer);

    const params = caption
      ? {
        video,
        "caption": caption,
      }
      : { video };

    return await socket.sendMessage(remoteJid, params, options);
  };


  const reply = async (text: string) => {
    return socket.sendMessage(
      webMessage.key.remoteJid,
      { text: text },
      { quoted: webMessage }
    );
  };

  return {
    sendText,
    sendImage,
    sendSticker,
    sendAudio,
    sendVideo,
    reply
  }
}

export const getBotData = (socket: any, webMessage?: proto.IWebMessageInfo): IBotProperties => {
  const { remoteJid } = webMessage.key;

  const {
    sendText,
    sendImage,
    sendSticker,
    sendAudio,
    sendVideo,
    reply
  } = getBotFunctions(socket, remoteJid, webMessage);

  if (webMessage) {
    const {
      userJid,
      id,
      messageText,
      quotedMessage,
      isGroup,
      isImage,
      isVideo,
      isSticker,
      isAudio,
      isDocument,
      mentionedJid,
      replyJid,
      buttonsResponseMessage
    } = extractDataFromWebMessage(webMessage);

    const { command, args } = extractCommandAndArgs(buttonsResponseMessage ? buttonsResponseMessage.selectedButtonId : messageText);

    return {
      sendText,
      sendImage,
      sendSticker,
      sendAudio,
      sendVideo,
      reply,
      remoteJid,
      userJid,
      id,
      replyJid,
      quotedMessage,
      socket,
      webMessage,
      command,
      args,
      isGroup,
      isImage,
      isVideo,
      isSticker,
      isAudio,
      mentionedJid,
      isDocument,
      buttonsResponseMessage
    };

  };

  return {
    sendText,
    sendImage,
    sendSticker,
    sendAudio,
    sendVideo,
    reply,
    remoteJid
  };
};

export const getCommand = (commandName: string) => {
  const pathCommands = pm.join(__dirname, "commands");

  if (!commandName) return;
  
  const command = fs
    .readdirSync(pathCommands)
    .find((file) => file.split(".")[0] == commandName.toLocaleLowerCase());

  if (!command) {
    throw new Error(
      `⚠ Esse comando não existe! Digite ${getConfig().prefix}ajuda [ Para ver a lista de commandos ]`
    );
  }
  
  return require(`./commands/${command}`).default;
};

export const readJSON = (pathFile: string): any => {
  // @ts-ignore
  return JSON.parse(fs.readFileSync(pathFile));
};

export const writeJSON = (pathFile: string, data: any) => {
  fs.writeFileSync(pathFile, JSON.stringify(data));
};

export const extractDataFromWebMessage = (message: proto.IWebMessageInfo) => {
  let remoteJid: string;
  let id: string;
  let messageText: string | null | undefined;

  let isReply = false;

  let replyJid: string | null = null;
  let replyText: string | null = null;

  const {
    key: { remoteJid: jid, participant: tempUserJid, id: messageID },
  } = message;

  if (jid) {
    remoteJid = jid;
  }

  if (messageID) {
    id = messageID;
  }

  if (message) {
    const extendedTextMessage = message.message?.extendedTextMessage;
    const buttonTextMessage = message.message?.buttonsResponseMessage;
    const listTextMessage = message.message?.listResponseMessage;

    messageText = 
      message.message?.conversation || 
      extendedTextMessage?.text || 
      message.message?.imageMessage?.caption || 
      buttonTextMessage?.selectedButtonId || 
      listTextMessage?.singleSelectReply?.selectedRowId || 
      message?.message?.videoMessage?.caption || "";

    isReply =
      !!extendedTextMessage && !!extendedTextMessage.contextInfo?.quotedMessage;

    replyJid =
      extendedTextMessage && extendedTextMessage.contextInfo?.participant
        ? extendedTextMessage.contextInfo.participant
        : null;

    replyText = extendedTextMessage?.contextInfo?.quotedMessage?.conversation;
  }

  let userJid = tempUserJid?.replace(/:[0-9][0-9]|:[0-9]/g, "");
  if (!userJid) {
    userJid = remoteJid;
  }

  const tempMessage = message?.message;

  const isGroup = jid.endsWith("@g.us");

  const isImage =
    !!tempMessage?.imageMessage ||
    !!tempMessage?.extendedTextMessage?.contextInfo?.quotedMessage
      ?.imageMessage;

  const isVideo =
    !!tempMessage?.videoMessage ||
    !!tempMessage?.extendedTextMessage?.contextInfo?.quotedMessage
      ?.videoMessage;

  const isAudio =
    !!tempMessage?.audioMessage ||
    !!tempMessage?.extendedTextMessage?.contextInfo?.quotedMessage
      ?.audioMessage;

  const isSticker =
    !!tempMessage?.stickerMessage ||
    !!tempMessage?.extendedTextMessage?.contextInfo?.quotedMessage
      ?.stickerMessage;

  const isDocument =
    !!tempMessage?.documentMessage ||
    !!tempMessage?.extendedTextMessage?.contextInfo?.quotedMessage
      ?.documentMessage;

  const quotedMessage =
    tempMessage?.extendedTextMessage ||
    tempMessage?.extendedTextMessage?.contextInfo?.quotedMessage;

  const buttonsResponseMessage = tempMessage?.buttonsResponseMessage

  const mentionedJid =
    tempMessage?.extendedTextMessage?.contextInfo?.mentionedJid;

  return {
    userJid,
    id,
    remoteJid,
    quotedMessage,
    messageText,
    isGroup,
    isReply,
    replyJid,
    replyText,
    isAudio,
    isImage,
    isSticker,
    isVideo,
    isDocument,
    mentionedJid,
    buttonsResponseMessage,
    webMessage: message,
  };
};

export const extractCommandAndArgs = (message: string) => {
  if (!message) return { command: "", args: "" };

  const [command, ...args] = message.trim().split(" ");

  //const args = tempArgs.reduce((acc, arg) => acc + " " + arg, "").trim();

  return { command, args };
};

export const getPermissionLevel = (jid: string) => {
  const ownersPath = pm.join(__dirname, '..', 'settings', 'owners.json');
  const ownersData = readJSON(ownersPath);

  if (ownersData.superowners.includes(jid.split("@") ? jid.split("@")[0] : jid)) return 2;
  if (ownersData.owners.includes(jid.split("@")[0])) return 1;

  return 0;
}

export const isCommand = (message: string) =>
  message.length > 1 && message.startsWith(getConfig().prefix);

export const getRandomName = (extension?: string) => {
  const fileName = Math.floor(Math.random() * 10000);

  if (!extension) return fileName.toString();

  return `${fileName}.${extension}`;
};

export const downloadImage = async (
  webMessage: proto.IWebMessageInfo,
  fileName: string,
  folder: string | null = null,
  ...subFolders: string[]
) => {
  const content = (webMessage?.message?.imageMessage ||
    webMessage?.message?.extendedTextMessage?.contextInfo?.quotedMessage
      ?.imageMessage) as DownloadableMessage;

  if (!content) return null;

  const stream = await downloadContentFromMessage(content, "image");

  let buffer = Buffer.from([]);

  for await (const chunk of stream) {
    buffer = Buffer.concat([buffer, chunk]);
  }

  let directory = [__dirname, "..", "assets"];

  if (!folder) {
    directory = [...directory, "temp"];
  }

  if (folder) {
    directory = [...directory, folder];
  }

  if (subFolders.length) {
    directory = [...directory, ...subFolders];
  }

  const filePath = pm.resolve(...directory, `${fileName}.jpg`);

  await writeFile(filePath, buffer);

  return filePath;
};

export const getConfig = () => {
    return readJSON(pm.join(__dirname, '..', 'config.json'));
}

export const downloadVideo = async (
  webMessage: proto.IWebMessageInfo,
  fileName: string,
  folder: string | null = null,
  ...subFolders: string[]
) => {
  const content = (webMessage?.message?.videoMessage ||
    webMessage?.message?.extendedTextMessage?.contextInfo?.quotedMessage
      ?.videoMessage) as DownloadableMessage;

  if (!content) return null;

  const stream = await downloadContentFromMessage(content, "video");

  let buffer = Buffer.from([]);

  for await (const chunk of stream) {
    buffer = Buffer.concat([buffer, chunk]);
  }

  let directory = [__dirname, "..", "assets"];

  if (!folder) {
    directory = [...directory, "temp"];
  }

  if (folder) {
    directory = [...directory, folder];
  }

  if (subFolders.length) {
    directory = [...directory, ...subFolders];
  }

  const filePath = pm.resolve(...directory, `${fileName}.mp4`);

  await writeFile(filePath, buffer);

  return filePath;
};

export const downloadSticker = async (
  webMessage: proto.IWebMessageInfo,
  fileName: string,
  folder: string | null = null,
  ...subFolders: string[]
) => {
  const content = (webMessage?.message?.stickerMessage ||
    webMessage?.message?.extendedTextMessage?.contextInfo?.quotedMessage
      ?.stickerMessage) as DownloadableMessage;

  if (!content) return null;

  const stream = await downloadContentFromMessage(content, "sticker");

  let buffer = Buffer.from([]);

  for await (const chunk of stream) {
    buffer = Buffer.concat([buffer, chunk]);
  }

  let directory = [__dirname, "..", "assets"];

  if (!folder) {
    directory = [...directory, "temp"];
  }

  if (folder) {
    directory = [...directory, folder];
  }

  if (subFolders.length) {
    directory = [...directory, ...subFolders];
  }

  const filePath = pm.resolve(...directory, `${fileName}.webp`);

  await writeFile(filePath, buffer);

  return filePath;
};

export const isSuperAdmin = async (botData: IBotProperties) => {
  return await validate("superadmin", botData);
};

export const isAdmin = async (botData: IBotProperties) => {
  return (
    (await validate("admin", botData)) ||
    (await validate("superadmin", botData))
  );
};

export const validate = async (
  type: string,
  { remoteJid, socket, userJid }: IBotProperties
) => {
  if (!isJidGroup(remoteJid)) return true;

  const { participants } = await socket.groupMetadata(remoteJid);

  const participant = participants.find(
    (participant: GroupParticipant) => participant.id === userJid
  );

  return participant && participant.admin === type;
};

export const onlyNumbers = (text: string) => {
  return text.replace(/[^0-9]/g, "");
};

export const formatText = (text: string) => {
  return (text.replace(/\//g, '/')).replace(/<[^>]*>?/gm, '')
}


export async function getBuffer(url: string) {
  const res = await fetch(url, {
    headers: { "User-Agent": "okhttp/4.5.0" },
    method: "GET",
  });

  const buff = await res.buffer();

  if (buff) return { type: res.headers.get("content-type"), result: buff };

  return { type: res.headers.get("content-type"), result: "Error" };
}
