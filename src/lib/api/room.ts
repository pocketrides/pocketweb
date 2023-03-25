import type { IServerMessage, MessagesPayload } from '$lib/zod/Message';

export type RoomType = 'pocket' | 'post';

export type RoomMessage = IServerMessage;

type RoomConnectionMessageCallback = (message: IServerMessage) => void;
type RoomConnectionEarlyDisconnectCallback = () => void | Promise<void>;
type RoomConnectionNewCountCallback = (new_count: number) => void;

// what's going over the wires both ways
type TelegraphMessage<T = any> = {
  _type: 'message' | 'connect' | 'connect_confirm' | 'disconnect' | 'new_count';
  room_key?: string;
  session_id?: string;
  data?: T;
};

// whoever is using this room, this is the connection to it.
export type RoomConnection = {
  // when you're connected, you can send a message
  sendMessage: (message: RoomMessage, latest_room_key?: string) => Promise<void>;

  // you can also update the reply count
  updateCount: (new_count: number) => Promise<void>;

  // you can handle new messages
  handleMessage: (callback: RoomConnectionMessageCallback) => void;

  // you can handle an early disconnect
  handleEarlyDisconnect: (callback: RoomConnectionEarlyDisconnectCallback) => void;

  // you can handle receiving a new count
  handleNewCount: (callback: RoomConnectionNewCountCallback) => void;

  // finally, you can disconnect when done w/ the room
  disconnect: typeof Room.disconnect;
};

export class Room {
  static host: string; // wss://chat.pocketrides.com

  static #socket: WebSocket | undefined;

  static #getConnectionString = (room_type: RoomType, room_id: string) => {
    return `${this.host}/${room_type}/${room_id}/connect`;
  };

  static #send<T>(wire: TelegraphMessage<T>) {
    try {
      this.#socket?.send(JSON.stringify(wire));
    } catch (e) {
      // console.warn('error sending', e);
    }
  }

  static async connect(room_type: RoomType, room_id: string, room_key?: string) {
    return new Promise<RoomConnection | undefined>(async (resolve) => {
      if (this.#socket) {
        // console.warn('> call disconnect next time', this.#socket);
        this.disconnect();
      }

      try {
        if (this.#socket) this.#socket = undefined;
        this.#socket = new WebSocket(this.#getConnectionString(room_type, room_id));
      } catch (e) {
        this.#socket = undefined;
      }

      if (this.#socket) {
        let session_id: string;

        this.#socket.addEventListener('error', (e: any) => {
          this.#send({
            _type: 'disconnect',
            session_id
          });

          this.disconnect();
        });

        this.#socket.addEventListener('close', (msg: any) => {
          this.disconnect();
        });

        this.#socket.addEventListener('message', (e: MessageEvent) => {
          const msg = JSON.parse(e.data) as TelegraphMessage;

          switch (msg._type) {
            case 'connect_confirm':
              if (msg.session_id) session_id = msg.session_id;
              break;
          }
        });

        this.#socket.addEventListener('open', (e: any) => {
          this.#send({
            _type: 'connect',
            room_key
          });
        });

        let room: RoomConnection = {
          sendMessage: async (message: RoomMessage, latest_room_key?: string) => {
            this.#send<RoomMessage>({
              room_key: latest_room_key || room_key,
              _type: 'message',
              data: message
            });
          },
          updateCount: async (new_count: number) => {
            this.#send<number>({
              room_key,
              _type: 'new_count',
              data: new_count
            });
          },
          handleMessage: (callback: RoomConnectionMessageCallback) => {
            this.#socket?.addEventListener('message', (e: MessageEvent) => {
              const msg = JSON.parse(e.data) as TelegraphMessage<RoomMessage>;
              if (msg._type === 'message' && msg.data) callback(msg.data);
            });
          },
          handleNewCount: (callback: RoomConnectionNewCountCallback) => {
            this.#socket?.addEventListener('message', (e: MessageEvent) => {
              const msg = JSON.parse(e.data) as TelegraphMessage<number>;
              if (msg._type === 'new_count' && msg.data) callback(msg.data);
            });
          },
          handleEarlyDisconnect: (
            callback: RoomConnectionEarlyDisconnectCallback
          ) => {
            this.#socket?.addEventListener(
              'error',
              () => {
                try {
                  if (this.#socket) this.disconnect();
                  callback()?.then(() => {});
                } catch (e) {}
              },
              { once: true }
            );
          },
          disconnect: () => {
            this.#send({
              _type: 'disconnect',
              session_id
            });

            return this.disconnect();
          }
        };

        resolve(room);
      } else {
        resolve(undefined);
      }
    });
  }

  static disconnect() {
    if (this.#socket) {
      try {
        this.#socket.close(1000);
      } catch (e) {}

      this.#socket = undefined;
    }
  }
}
