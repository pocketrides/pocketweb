export class IDBCache {
  static #db: IDBDatabase;

  static async #open(): Promise<undefined> {
    return new Promise((resolve) => {
      if (IDBCache.#db) return resolve(undefined);

      const request = indexedDB.open('cache', 4);

      request.onupgradeneeded = (e: any) => {
        const db: IDBDatabase = e.target.result;

        try {
          db.deleteObjectStore('cache');
        } catch (e) {}

        db.createObjectStore('cache', { keyPath: 'id' });
      };

      request.onsuccess = (e: any) => {
        IDBCache.#db = e.target.result;
        resolve(undefined);
      };
    });
  }

  static async get<T>(id: string): Promise<T | undefined> {
    return new Promise(async (resolve) => {
      if (typeof indexedDB === 'undefined') return resolve(undefined);

      await IDBCache.#open();
      if (!this.#db) resolve(undefined);
      const transaction = IDBCache.#db.transaction('cache');
      const store = transaction.objectStore('cache');
      const request = store.get(id);

      request.onerror = () => resolve(undefined);

      request.onsuccess = (e: any) => {
        if (e.target.result) resolve(e.target.result as T);
        else resolve(undefined);
      };
    });
  }

  static async put(obj: any) {
    return new Promise(async (resolve) => {
      if (typeof indexedDB === 'undefined') return resolve(undefined);

      await IDBCache.#open();
      if (!this.#db) resolve(undefined);
      const transaction = IDBCache.#db.transaction('cache', 'readwrite');
      const store = transaction.objectStore('cache');

      transaction.onerror = () => {
        resolve(undefined);
      };

      transaction.oncomplete = () => {
        resolve(undefined);
      };

      store.put(obj);
    });
  }

  static async delete(id: string): Promise<true | false> {
    return new Promise(async (resolve) => {
      if (typeof indexedDB === 'undefined') return resolve(false);

      await IDBCache.#open();
      if (!this.#db) resolve(false);
      const transaction = IDBCache.#db.transaction('cache', 'readwrite');
      const store = transaction.objectStore('cache');
      const request = store.delete(id);

      request.onerror = () => {
        resolve(false);
      };

      request.onsuccess = () => {
        resolve(true);
      };
    });
  }

  static async clear() {
    return new Promise(async (resolve) => {
      if (typeof indexedDB === 'undefined') return resolve(undefined);

      await this.#open();
      if (!this.#db) resolve(undefined);
      const transaction = this.#db.transaction('cache', 'readwrite');
      const store = transaction.objectStore('cache');

      transaction.oncomplete = () => resolve(undefined);
      transaction.onerror = () => resolve(undefined);

      store.clear();
    });
  }
}
