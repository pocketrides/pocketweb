import type { ClientReply } from '$lib/zod/Reply';
import { writable } from 'svelte/store';
import { App } from './app';

export interface RepliesManagerStoreInterface {
  post_id: string | undefined;
  replies: ClientReply[] | undefined;
}

export const RepliesManagerStore = writable<RepliesManagerStoreInterface>({
  post_id: undefined,
  replies: undefined
});

export class RepliesManager {
  static openReplies(post_id?: string, replies?: ClientReply[]) {
    RepliesManagerStore.update((s) => {
      s.post_id = post_id;
      s.replies = replies;

      return s;
    });

    App.update((a) => {
      a.sheet_id = 'post_replies';

      return a;
    });
  }
}
