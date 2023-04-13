import { LoadPostRequest } from '$lib/api/post/load';
import { error, redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load = (async (event) => {
  const post = await LoadPostRequest.load(event.params.post_id, event.fetch, true);

  if (!post) throw error(404);

  const parent = await event.parent();

  if (
    post.settings.is_nsfw &&
    parent.my_nametag?.content_prefs?.allow_nsfw_posts !== true &&
    event.url.searchParams.has('ok') !== true
  )
    throw redirect(302, `/post/${post.id}/nsfw-warning`);

  return {
    post,
    my_nametag: parent.my_nametag,
    page_theme: post?.nametag.theme,
    room_key: parent.room_key
  };
}) satisfies PageLoad;
