import type { ClientReply } from '$lib/zod/Reply';
import { writable } from 'svelte/store';
import { App } from './app';
import { RetrieveRepliesRequest } from '$lib/api/reply/retrieve';

export interface RepliesManagerStoreInterface {
  post_id: string | undefined;
  replies: ClientReply[] | undefined;
  latest_count: number;
}

export const RepliesManagerStore = writable<RepliesManagerStoreInterface>({
  post_id: undefined,
  replies: undefined,
  latest_count: 0
});

export class RepliesManager {
  static async loadReplies(post_id: string, initial_count: number): Promise<void> {
    return new Promise(async (resolve) => {
      const res = await RetrieveRepliesRequest.get(post_id);

      if (res.success) {
        RepliesManagerStore.update((prev) => {
          prev.post_id = post_id;
          prev.replies = res.data.replies;
          prev.latest_count = initial_count;

          return prev;
        });

        resolve();
      } else {
        console.log(res);
        resolve();
      }
    });
  }

  static async openReplies(post_id: string, initial_count: number): Promise<void> {
    return new Promise(async (resolve) => {
      await this.loadReplies(post_id, initial_count);

      App.update((a) => {
        a.sheet_id = 'post_replies';

        return a;
      });

      resolve();
    });
  }
}
