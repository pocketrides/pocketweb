import type { IServerMessage, MessagesPayload } from '$lib/zod/Message';

export type RoomType = 'pocket' | 'post';

export type RoomMessage = IServerMessage;

type RoomConnectionMessageCallback = (message: IServerMessage) => void;
type RoomConnectionEarlyDisconnectCallback = () => void | Promise<void>;

// what's going over the wires both ways
type TelegraphMessage<T = any> = {
  _type: 'message' | 'connect' | 'connect_confirm' | 'disconnect';
  room_key?: string;
  session_id?: string;
  data?: T;
};

// whoever is using this room, this is the connection to it.
export type RoomConnection = {
  // when you're connected, you can send a message
  sendMessage: (message: RoomMessage) => Promise<void>;

  // you can handle new messages (sent in a batch)
  handleMessage: (callback: RoomConnectionMessageCallback) => void;

  // you can handle an early disconnect
  handleEarlyDisconnect: (callback: RoomConnectionEarlyDisconnectCallback) => void;

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
      console.warn('error sending', e);
    }
  }

  static async connect(room_type: RoomType, room_id: string, room_key?: string) {
    return new Promise<RoomConnection | undefined>(async (resolve) => {
      if (this.#socket) {
        console.warn('> call disconnect next time', this.#socket);
        this.disconnect();
      }

      try {
        this.#socket = new WebSocket(this.#getConnectionString(room_type, room_id));
      } catch (e) {
        this.#socket = undefined;
      }

      if (this.#socket) {
        let session_id: string;

        this.#socket.addEventListener('error', (e: any) => {
          console.log('> error');

          this.#send({
            _type: 'disconnect',
            session_id
          });

          this.disconnect();
        });

        this.#socket.addEventListener('close', (msg: any) => {
          console.log('> close');
          this.disconnect();
        });

        this.#socket.addEventListener('message', (e: MessageEvent) => {
          const msg = JSON.parse(e.data) as TelegraphMessage;
          console.log('>>', msg);

          switch (msg._type) {
            case 'connect_confirm':
              if (msg.session_id) session_id = msg.session_id;
              break;
          }
        });

        this.#socket.addEventListener('open', (e: any) => {
          console.info('open', e);
          this.#send({
            _type: 'connect',
            room_key
          });
        });

        let room = {
          sendMessage: async (message: RoomMessage) => {
            this.#send<RoomMessage>({
              room_key,
              _type: 'message',
              data: message
            });
          },
          handleMessage: (callback: RoomConnectionMessageCallback) => {
            this.#socket?.addEventListener('message', (e: MessageEvent) => {
              const msg = JSON.parse(e.data) as TelegraphMessage<RoomMessage>;
              if (msg._type === 'message' && msg.data) callback(msg.data);
            });
          },
          handleEarlyDisconnect: (
            callback: RoomConnectionEarlyDisconnectCallback
          ) => {
            this.#socket?.addEventListener(
              'close',
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
