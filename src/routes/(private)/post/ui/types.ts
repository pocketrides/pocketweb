import type { DraftPost } from '$lib/zod/Post';
import type { Writable } from 'svelte/store';

export type PageController = DraftPost;

export type PageControllerStore = Writable<PageController>;
