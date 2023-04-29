import { IDBCache } from './idb-cache';
import { IDB_VERSION } from './idb-cache-version';

export class IDBFeedCache {
  static #db: IDBDatabase;

  static async #open(): Promise<undefined> {
    return new Promise((resolve) => {
      if (this.#db) return resolve(undefined);

      const request = indexedDB.open('feed_cache', IDB_VERSION);

      request.onupgradeneeded = (e: any) => {
        const db: IDBDatabase = e.target.result;

        try {
          db.deleteObjectStore('feed_cache');
        } catch (e) {}

        db.createObjectStore('feed_cache', { keyPath: '' });
      };

      request.onsuccess = (e: any) => {
        this.#db = e.target.result;
        resolve(undefined);
      };
    });
  }

  static async #close(a: any) {
    try {
      if (this.#db) {
        this.#db.close();
      }
    } catch (e) {}
  }

  static async save(post_ids: string[]): Promise<undefined> {
    return new Promise(async (resolve) => {
      if (typeof indexedDB === 'undefined') return resolve(undefined);

      await this.#open();
      if (!this.#db) resolve(undefined);
      const transaction = this.#db.transaction('feed_cache', 'readwrite');
      const store = transaction.objectStore('feed_cache');

      transaction.onerror = () => this.#close(resolve(undefined));
      transaction.oncomplete = () => this.#close(resolve(undefined));

      post_ids.forEach(async (post_id) => {
        return new Promise(async (resolve) => {
          const input = store.put(post_id);
          input.onsuccess = () => this.#close(resolve(undefined));
          input.onerror = () => this.#close(resolve(undefined));
        });
      });

      resolve(undefined);
    });
  }

  static async getFeed(): Promise<string[]> {
    return new Promise(async (resolve) => {
      if (typeof indexedDB === 'undefined') return resolve([]);

      await this.#open();
      if (!this.#db) resolve([]);
      const transaction = this.#db.transaction('feed_cache', 'readwrite');
      const store = transaction.objectStore('feed_cache');

      transaction.onerror = () => this.#close(resolve([]));

      const request = store.openCursor(undefined, 'prev');

      let post_ids: string[] = [];

      request.onsuccess = (e: any) => {
        const cursor: IDBCursorWithValue | undefined = e.target.result;

        if (cursor && post_ids.length >= 80) {
          store.delete(cursor.key);
          cursor.continue();
        } else if (cursor) {
          post_ids.unshift(cursor.key.toString());
          cursor.continue();
        } else {
          this.#close(resolve(post_ids));
        }
      };

      request.onerror = () => this.#close(resolve([]));
    });
  }

  static async saveLastId(last_id: string): Promise<undefined> {
    return new Promise(async (resolve) => {
      if (typeof indexedDB === 'undefined') return resolve(undefined);

      await IDBCache.put({ id: 'feed_cache', last_id });

      this.#close(resolve(undefined));
    });
  }

  static async getLastId(): Promise<string | undefined> {
    return new Promise(async (resolve) => {
      if (typeof indexedDB === 'undefined') return resolve(undefined);

      const cache = await IDBCache.get<{ id: string; last_id: string }>(
        'feed_cache'
      );

      if (cache && cache.last_id) this.#close(resolve(cache.last_id));
      else this.#close(resolve(undefined));
    });
  }

  static async clear(): Promise<undefined> {
    return new Promise(async (resolve) => {
      if (typeof indexedDB === 'undefined') return resolve(undefined);

      await this.#open();
      if (!this.#db) resolve(undefined);
      const transaction = this.#db.transaction('feed_cache', 'readwrite');
      const store = transaction.objectStore('feed_cache');

      transaction.oncomplete = () => this.#close(resolve(undefined));
      transaction.onerror = () => this.#close(resolve(undefined));

      store.clear();

      await IDBCache.delete('feed_cache');
    });
  }
}
