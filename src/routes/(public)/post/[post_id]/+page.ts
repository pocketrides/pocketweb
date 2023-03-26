import { LoadPostRequest } from '$lib/api/post/load';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load = (async (event) => {
  const post = await LoadPostRequest.load(event.params.post_id, event.fetch);

  if (!post) throw error(404);

  const parent = await event.parent();

  return {
    post,
    my_nametag: parent.my_nametag,
    page_theme: post?.nametag.theme,
    room_key: parent.room_key
  };
}) satisfies PageLoad;
