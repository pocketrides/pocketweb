import { LoadPostRequest } from '$lib/api/post/load';
import type { PageServerLoad } from './$types';

export const load = (async (event) => {
  const parent = await event.parent();
  const post = await LoadPostRequest.load(event.params.post_id, event.fetch, true);

  return {
    ...parent,
    post_id: event.params.post_id,
    post
  };
}) satisfies PageServerLoad;
