import { IDB_VERSION } from './idb-cache-version';

export class IDBCache {
  static #db: IDBDatabase | undefined;

  static async #open(): Promise<undefined> {
    return new Promise((resolve) => {
      if (this.#db) return resolve(undefined);

      const request = indexedDB.open('cache', IDB_VERSION);

      request.onupgradeneeded = (e: any) => {
        const db: IDBDatabase = e.target.result;

        try {
          db.deleteObjectStore('cache');
        } catch (e) {}

        db.createObjectStore('cache', { keyPath: 'id' });
      };

      request.onsuccess = (e: any) => {
        this.#db = e.target.result;
        resolve(undefined);
      };
    });
  }

  static async #close(a: any) {
    setTimeout(() => {
      try {
        if (this.#db) this.#db.close();
        this.#db = undefined;
      } catch (e) {}
    }, 200);
  }

  static async get<T>(id: string): Promise<T | undefined> {
    return new Promise(async (resolve) => {
      if (typeof indexedDB === 'undefined') return resolve(undefined);

      await this.#open();
      if (!this.#db) resolve(undefined);
      if (this.#db) {
        const transaction = this.#db.transaction('cache');
        const store = transaction.objectStore('cache');
        const request = store.get(id);

        request.onerror = () => this.#close(resolve(undefined));

        request.onsuccess = (e: any) => {
          if (e.target.result) this.#close(resolve(e.target.result as T));
          else this.#close(resolve(undefined));
        };
      }
    });
  }

  static async put(obj: any) {
    return new Promise(async (resolve) => {
      if (typeof indexedDB === 'undefined') return resolve(undefined);

      await this.#open();
      if (!this.#db) resolve(undefined);
      if (this.#db) {
        const transaction = this.#db.transaction('cache', 'readwrite');
        const store = transaction.objectStore('cache');

        transaction.onerror = () => {
          this.#close(resolve(undefined));
        };

        transaction.oncomplete = () => {
          this.#close(resolve(undefined));
        };

        store.put(obj);
      }
    });
  }

  static async delete(id: string): Promise<true | false> {
    return new Promise(async (resolve) => {
      if (typeof indexedDB === 'undefined') return resolve(false);

      await this.#open();
      if (!this.#db) resolve(false);
      if (this.#db) {
        const transaction = this.#db.transaction('cache', 'readwrite');
        const store = transaction.objectStore('cache');
        const request = store.delete(id);

        request.onerror = () => {
          this.#close(resolve(false));
        };

        request.onsuccess = () => {
          this.#close(resolve(true));
        };
      }
    });
  }

  static async clear() {
    return new Promise(async (resolve) => {
      if (typeof indexedDB === 'undefined') return resolve(undefined);

      await this.#open();
      if (!this.#db) resolve(undefined);
      if (this.#db) {
        const transaction = this.#db.transaction('cache', 'readwrite');
        const store = transaction.objectStore('cache');

        transaction.oncomplete = () => this.#close(resolve(undefined));
        transaction.onerror = () => this.#close(resolve(undefined));

        store.clear();
      }
    });
  }
}
