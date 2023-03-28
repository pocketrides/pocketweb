import type { CloudinaryPhoto } from '$lib/zod/CloudinaryPhoto';
import { writable } from 'svelte/store';

export const Photos = writable<{
  photos: CloudinaryPhoto[];
  selected?: CloudinaryPhoto;
}>({
  photos: [],
  selected: undefined
});
