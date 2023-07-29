import { writable } from 'svelte/store';
import { App } from './app';

export interface AddPostTo {
  post_id: string | undefined;
}

export const AddPostTo = writable<AddPostTo>({
  post_id: undefined
});

AddPostTo.subscribe((v) => {
  if (v.post_id !== undefined) {
    App.update((p) => {
      p.sheet_id = 'add_post_to';

      return p;
    });
  }
});
