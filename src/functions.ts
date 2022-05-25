import { proto, DownloadableMessage, downloadContentFromMessage, GroupParticipant, isJidGroup } from "@adiwajshing/baileys";
import fs from "fs";
import pm from 'path';
import { writeFile } from "fs/promises";
import { IBotData } from "./interfaces/IBotData";
import { general } from "./configurations/general";

export const getBotData = (socket: any, webMessage: proto.IWebMessageInfo ): IBotData => {
    const { remoteJid } = webMessage.key;

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

  const reply = async (text: string) => {
    return socket.sendMessage(
      webMessage.key.remoteJid,
      { text: text },
      { quoted: webMessage }
    );
  };

  const {
    userJid,
    messageText,
    isImage,
    isVideo,
    isSticker,
    isAudio,
    isDocument,
    replyJid,
  } = extractDataFromWebMessage(webMessage);

  const { command, args } = extractCommandAndArgs(messageText);

  return {
    sendText,
    sendImage,
    sendSticker,
    sendAudio,
    reply,
    remoteJid,
    userJid,
    replyJid,
    socket,
    webMessage,
    command,
    args,
    isImage,
    isVideo,
    isSticker,
    isAudio,
    isDocument,
  };
};

export const getCommand = (commandName: string) => {
  const pathCache = pm.join(__dirname, "..", "cache", "commands.json");
  const pathCommands = pm.join(__dirname, "commands");

  const cacheCommands = readJSON(pathCache);

  if (!commandName) return;

  const cacheCommand = cacheCommands.find(
    (name: string) => name === commandName
  );

  if (!cacheCommand) {
    const command = fs
      .readdirSync(pathCommands)
      .find((file) => file.includes(commandName));

    if (!command) {
      throw new Error(
        `⚠ Esse comando não existe! Digite ${general.prefix}ajuda [ Para ver a lista de commandos ]`
      );
    }

    writeJSON(pathCache, [...cacheCommands, commandName]);

    return require(`./commands/${command}`).default;
  }

  return require(`./commands/${cacheCommand}`).default;
};

export const readJSON = (pathFile: string) => {
  // @ts-ignore
  return JSON.parse(fs.readFileSync(pathFile));
};

export const writeJSON = (pathFile: string, data: any) => {
  fs.writeFileSync(pathFile, JSON.stringify(data));
};

export const extractDataFromWebMessage = (message: proto.IWebMessageInfo) => {
  let remoteJid: string;
  let messageText: string | null | undefined;

  let isReply = false;

  let replyJid: string | null = null;
  let replyText: string | null = null;

  const {
    key: { remoteJid: jid, participant: tempUserJid },
  } = message;

  if (jid) {
    remoteJid = jid;
  }

  if (message) {
    const extendedTextMessage = message.message?.extendedTextMessage;
    const buttonTextMessage = message.message?.buttonsResponseMessage;
    const listTextMessage = message.message?.listResponseMessage;

    const type1 = message.message?.conversation;

    const type2 = extendedTextMessage?.text;

    const type3 = message.message?.imageMessage?.caption;

    const type4 = buttonTextMessage?.selectedButtonId;

    const type5 = listTextMessage?.singleSelectReply?.selectedRowId;

    const type6 = message?.message?.videoMessage?.caption;

    messageText = type1 || type2 || type3 || type4 || type5 || type6 || "";

    isReply =
      !!extendedTextMessage && !!extendedTextMessage.contextInfo?.quotedMessage;

    replyJid =
      extendedTextMessage && extendedTextMessage.contextInfo?.participant
        ? extendedTextMessage.contextInfo.participant
        : null;

    replyText = extendedTextMessage?.contextInfo?.quotedMessage?.conversation;
  }

  const userJid = tempUserJid?.replace(/:[0-9][0-9]|:[0-9]/g, "");

  const tempMessage = message?.message;

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

  let mentionedJid = "";

  let mentionedJidObject =
    tempMessage?.extendedTextMessage?.contextInfo?.mentionedJid;

  if (mentionedJidObject) {
    mentionedJid = mentionedJidObject[0];
  }

  return {
    userJid,
    remoteJid,
    messageText,
    isReply,
    replyJid,
    replyText,
    isAudio,
    isImage,
    isSticker,
    isVideo,
    isDocument,
    mentionedJid,
    webMessage: message,
  };
};

export const extractCommandAndArgs = (message: string) => {
  if (!message) return { command: "", args: "" };

  const [command, ...args] = message.trim().split(" ");

  //const args = tempArgs.reduce((acc, arg) => acc + " " + arg, "").trim();

  return { command, args };
};

export const isCommand = (message: string) =>
  message.length > 1 && message.startsWith(general.prefix);

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

export const isSuperAdmin = async (botData: IBotData) => {
  return await validate("superadmin", botData);
};

export const isAdmin = async (botData: IBotData) => {
  return (
    (await validate("admin", botData)) ||
    (await validate("superadmin", botData))
  );
};

export const validate = async (
  type: string,
  { remoteJid, socket, userJid }: IBotData
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

/*
export async function getBuffer(url: string) {
  const res = await fetch(url, {
    headers: { "User-Agent": "okhttp/4.5.0" },
    method: "GET",
  });

  const buff = await res.buffer();

  if (buff) return { type: res.headers.get("content-type"), result: buff };

  return { type: res.headers.get("content-type"), result: "Error" };
}
*/