import { Feed } from '$lib/server/db/Feed';
import type { PageServerLoad } from './$types';

export const load = (async (event) => {
  const parent = await event.parent();

  const feed = await Feed.getNametagFeed(parent.page_nametag.id);

  return {
    ...parent,
    post_ids: feed.post_ids,
    after_id: feed.after_id,
    has_more: feed.has_more
  };
}) satisfies PageServerLoad;
