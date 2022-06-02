import { proto } from "@adiwajshing/baileys";

export interface IBotProperties {
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
  isGroup?: boolean;
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

export interface ISocket {
    getOrderDetails: (orderId: string, tokenBase64: string) => Promise<import("@adiwajshing/baileys/lib/Types").OrderDetails>;
    getCatalog: (jid?: string, limit?: number) => Promise<{
        products: import("@adiwajshing/baileys/lib/Types").Product[];
    }>;
    getCollections: (jid?: string, limit?: number) => Promise<{
        collections: import("@adiwajshing/baileys/lib/Types").CatalogCollection[];
    }>;
    productCreate: (create: import("@adiwajshing/baileys/lib/Types").ProductCreate) => Promise<import("@adiwajshing/baileys/lib/Types").Product>;
    productDelete: (productIds: string[]) => Promise<{
        deleted: number;
    }>;
    productUpdate: (productId: string, update: import("@adiwajshing/baileys/lib/Types").ProductUpdate) => Promise<import("@adiwajshing/baileys/lib/Types").Product>;
    processMessage: (msg: import("@adiwajshing/baileys/lib/Types").WAProto.IWebMessageInfo) => Promise<Partial<import("@adiwajshing/baileys/lib/Types").BaileysEventMap<any>>>;
    sendMessageAck: ({ tag, attrs }: import("@adiwajshing/baileys/lib").BinaryNode, extraAttrs: {
        [key: string]: string;
    }) => Promise<void>;
    sendRetryRequest: (node: import("@adiwajshing/baileys/lib").BinaryNode) => Promise<void>;
    appPatch: (patchCreate: import("@adiwajshing/baileys/lib/Types").WAPatchCreate) => Promise<void>;
    sendPresenceUpdate: (type: import("@adiwajshing/baileys/lib/Types").WAPresence, toJid?: string) => Promise<void>;
    presenceSubscribe: (toJid: string) => Promise<void>;
    profilePictureUrl: (jid: string, type?: "image" | "preview", timeoutMs?: number) => Promise<string>;
    onWhatsApp: (...jids: string[]) => Promise<{
        exists: boolean;
        jid: string;
    }[]>;
    fetchBlocklist: () => Promise<string[]>;
    fetchStatus: (jid: string) => Promise<{
        status: string;
        setAt: Date;
    }>;
    updateProfilePicture: (jid: string, content: import("@adiwajshing/baileys/lib/Types").WAMediaUpload) => Promise<void>;
    updateBlockStatus: (jid: string, action: "block" | "unblock") => Promise<void>;
    getBusinessProfile: (jid: string) => Promise<void | import("@adiwajshing/baileys/lib/Types").WABusinessProfile>;
    resyncAppState: (collections: import("@adiwajshing/baileys/lib/Types").WAPatchName[]) => Promise<import("@adiwajshing/baileys/lib/Types").AppStateChunk>;
    chatModify: (mod: import("@adiwajshing/baileys/lib/Types").ChatModification, jid: string) => Promise<void>;
    resyncMainAppState: () => Promise<void>;
    assertSessions: (jids: string[], force: boolean) => Promise<boolean>;
    relayMessage: (jid: string, message: import("@adiwajshing/baileys/lib/Types").WAProto.IMessage, { messageId: msgId, participant, additionalAttributes, cachedGroupMetadata }: import("@adiwajshing/baileys/lib/Types").MessageRelayOptions) => Promise<string>;
    sendReceipt: (jid: string, participant: string, messageIds: string[], type: import("@adiwajshing/baileys/lib/Types").MessageReceiptType) => Promise<void>;
    sendReadReceipt: (jid: string, participant: string, messageIds: string[]) => Promise<void>;
    readMessages: (keys: import("@adiwajshing/baileys/lib/Types").WAProto.IMessageKey[]) => Promise<void>;
    refreshMediaConn: (forceGet?: boolean) => Promise<import("@adiwajshing/baileys/lib/Types").MediaConnInfo>;
    waUploadToServer: import("@adiwajshing/baileys/lib/Types").WAMediaUploadFunction;
    fetchPrivacySettings: (force?: boolean) => Promise<{
        [_: string]: string;
    }>;
    sendMessage: (jid: string, content: import("@adiwajshing/baileys/lib/Types").AnyMessageContent, options?: import("@adiwajshing/baileys/lib/Types").MiscMessageGenerationOptions) => Promise<import("@adiwajshing/baileys/lib/Types").WAProto.WebMessageInfo>;
    groupMetadata: (jid: string) => Promise<import("@adiwajshing/baileys/lib/Types").GroupMetadata>;
    groupCreate: (subject: string, participants: string[]) => Promise<import("@adiwajshing/baileys/lib/Types").GroupMetadata>;
    groupLeave: (id: string) => Promise<void>;
    groupUpdateSubject: (jid: string, subject: string) => Promise<void>;
    groupParticipantsUpdate: (jid: string, participants: string[], action: import("@adiwajshing/baileys/lib/Types").ParticipantAction) => Promise<{
        status: string | number;
        jid: string;
    }[]>;
    groupUpdateDescription: (jid: string, description?: string) => Promise<void>;
    groupInviteCode: (jid: string) => Promise<string>;
    groupRevokeInvite: (jid: string) => Promise<string>;
    groupAcceptInvite: (code: string) => Promise<string>;
    groupAcceptInviteV4: (jid: string, inviteMessage: import("@adiwajshing/baileys/lib/Types").WAProto.IGroupInviteMessage) => Promise<string>;
    groupToggleEphemeral: (jid: string, ephemeralExpiration: number) => Promise<void>;
    groupSettingUpdate: (jid: string, setting: "announcement" | "locked" | "not_announcement" | "unlocked") => Promise<void>;
    groupFetchAllParticipating: () => Promise<{
        [_: string]: import("@adiwajshing/baileys/lib/Types").GroupMetadata;
    }>;
    type: "md";
    ws: import("ws");
    ev: import("@adiwajshing/baileys/lib/Types").BaileysEventEmitter;
    authState: {
        creds: import("@adiwajshing/baileys/lib/Types").AuthenticationCreds;
        keys: import("@adiwajshing/baileys/lib/Types").SignalKeyStoreWithTransaction;
    };
    user: import("@adiwajshing/baileys/lib/Types").Contact;
    emitEventsFromMap: (map: Partial<import("@adiwajshing/baileys/lib/Types").BaileysEventMap<import("@adiwajshing/baileys/lib/Types").AuthenticationCreds>>) => void;
    generateMessageTag: () => string;
    query: (node: import("@adiwajshing/baileys/lib").BinaryNode, timeoutMs?: number) => Promise<import("@adiwajshing/baileys/lib").BinaryNode>;
    waitForMessage: (msgId: string, timeoutMs?: number) => Promise<any>;
    waitForSocketOpen: () => Promise<void>;
    sendRawMessage: (data: Uint8Array | Buffer) => Promise<void>;
    sendNode: (frame: import("@adiwajshing/baileys/lib").BinaryNode) => Promise<void>;
    logout: () => Promise<void>;
    end: (error: Error) => void;
    onUnexpectedError: (error: Error, msg: string) => void;
    uploadPreKeys: (count?: number) => Promise<void>;
    waitForConnectionUpdate: (check: (u: Partial<import("@adiwajshing/baileys/lib/Types").ConnectionState>) => boolean, timeoutMs?: number) => Promise<void>;
}
