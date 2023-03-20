import type { MessagesPayload } from '$lib/zod/Message';
import type { ClientNametag } from '$lib/zod/Nametag';

export type RoomType = 'pocket' | 'post';

export type RoomMessageBatch = {
  nametag: ClientNametag;
  messages: MessagesPayload;
}[];

type RoomConnectionMessageCallback = (batch: RoomMessageBatch) => void;

// what's going over the wires both ways
type TelegraphMessage = {
  room_type: RoomType;
  room_id: string;
  room_key: string;
};

export type RoomConnection = {
  handleMessage: (callback: RoomConnectionMessageCallback) => void;
  sendMessage: (messages: MessagesPayload) => Promise<void>;
  disconnect: typeof Room.disconnect;
};

export class Room {
  static host: string; // wss://chat.pocketrides.com

  static #socket: WebSocket | undefined;

  static #getConnectionString = (room_type: RoomType, room_id: string) => {
    return `${this.host}/${room_type}/${room_id}/connect`;
  };

  static async connect(room_type: RoomType, room_id: string, room_key?: string) {
    return new Promise<RoomConnection | undefined>(async (resolve) => {
      if (this.#socket) {
        console.warn('> call disconnect next time', this.#socket);
        await this.disconnect();
      }

      try {
        const req: any = await fetch(this.#getConnectionString(room_type, room_id), {
          headers: {
            Authorization: 'Bearer ' + room_key,
            Upgrade: 'websocket'
          },
          mode: 'no-cors'
        });

        this.#socket = req.webSocket;
      } catch (e) {
        this.#socket = undefined;
      }

      if (this.#socket) {
        this.#socket.addEventListener('error', (e: any) => {
          this.disconnect();
        });

        this.#socket.addEventListener('close', (msg: any) => {
          this.disconnect();
        });

        this.#socket.addEventListener('open', (e: any) => {
          console.info('open', e);
        });

        this.#socket.addEventListener('message', (msg: any) => {
          console.log('message', msg);
        });

        resolve({
          handleMessage: (callback: RoomConnectionMessageCallback) => {
            this.#socket?.addEventListener(
              'message',
              (e: MessageEvent<TelegraphMessage>) => {
                console.log('message', e.data);
              }
            );
          },
          sendMessage: async (messages: MessagesPayload) => {
            this.#socket?.send(
              JSON.stringify({
                room_key,
                messages
              })
            );
          },
          disconnect: () => {
            return this.disconnect();
          }
        });
      } else {
        resolve(undefined);
      }
    });
  }

  static disconnect() {
    if (this.#socket) {
      try {
        this.#socket.close(1000, 'do you hear me');
      } catch (e) {
        console.warn(e);
      }

      this.#socket = undefined;
    }
  }
}
