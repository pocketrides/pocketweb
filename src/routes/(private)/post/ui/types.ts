import type { DraftPost } from '$lib/zod/Post';
import type { Writable } from 'svelte/store';

export type PageController = {
  target: 'friends' | 'close_friends' | 'pocket';
  pocket?: string;
  posts: DraftPost[];
};

export type PageControllerStore = Writable<PageController>;
