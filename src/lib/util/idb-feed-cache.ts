import { IDBCache } from './idb-cache';

export class IDBFeedCache {
  static #db: IDBDatabase;

  static async #open(): Promise<undefined> {
    return new Promise((resolve) => {
      if (this.#db) return resolve(undefined);

      const request = indexedDB.open('feed_cache', 1);

      request.onupgradeneeded = (e: any) => {
        const db: IDBDatabase = e.target.result;

        db.createObjectStore('feed_cache', { keyPath: '' });
      };

      request.onsuccess = (e: any) => {
        this.#db = e.target.result;
        resolve(undefined);
      };
    });
  }

  static async save(post_ids: string[]): Promise<undefined> {
    return new Promise(async (resolve) => {
      if (typeof indexedDB === 'undefined') return resolve(undefined);

      await this.#open();
      const transaction = this.#db.transaction('feed_cache', 'readwrite');
      const store = transaction.objectStore('feed_cache');

      transaction.onerror = () => resolve(undefined);
      transaction.oncomplete = () => resolve(undefined);

      post_ids.forEach(async (post_id) => {
        return new Promise(async (resolve) => {
          const input = store.put(post_id);
          input.onsuccess = () => resolve(undefined);
          input.onerror = () => resolve(undefined);
        });
      });

      resolve(undefined);
    });
  }

  static async getFeed(): Promise<string[]> {
    return new Promise(async (resolve) => {
      if (typeof indexedDB === 'undefined') return resolve([]);

      await this.#open();
      const transaction = this.#db.transaction('feed_cache', 'readwrite');
      const store = transaction.objectStore('feed_cache');

      transaction.onerror = () => resolve([]);

      const request = store.openCursor(undefined, 'prev');

      let post_ids: string[] = [];

      request.onsuccess = (e: any) => {
        const cursor: IDBCursorWithValue | undefined = e.target.result;

        if (cursor && post_ids.length >= 80) {
          store.delete(cursor.value);
          cursor.continue();
        } else if (cursor) {
          post_ids.unshift(cursor.value);
          cursor.continue();
        } else {
          resolve(post_ids);
        }
      };

      request.onerror = () => resolve([]);
    });
  }

  static async saveLastId(last_id: string): Promise<undefined> {
    return new Promise(async (resolve) => {
      if (typeof indexedDB === 'undefined') return resolve(undefined);

      await IDBCache.put({ id: 'feed_cache', last_id });

      resolve(undefined);
    });
  }

  static async getLastId(): Promise<string | undefined> {
    return new Promise(async (resolve) => {
      if (typeof indexedDB === 'undefined') return resolve(undefined);

      const cache = await IDBCache.get<{ id: string; last_id: string }>(
        'feed_cache'
      );

      if (cache && cache.last_id) resolve(cache.last_id);
      else resolve(undefined);
    });
  }

  static async clear(): Promise<undefined> {
    return new Promise(async (resolve) => {
      if (typeof indexedDB === 'undefined') return resolve(undefined);

      await this.#open();
      const transaction = this.#db.transaction('feed_cache', 'readwrite');
      const store = transaction.objectStore('feed_cache');

      transaction.oncomplete = () => resolve(undefined);
      transaction.onerror = () => resolve(undefined);

      store.clear();

      await IDBCache.delete('feed_cache');
    });
  }
}
