import { Feed } from '$lib/server/db/Feed';
import type { PageServerLoad } from './$types';

export const load = (async (event) => {
  const parent = await event.parent();

  const post_ids = await Feed.getHomeFeed(event.locals.nametag_id as string);

  return {
    my_nametag: parent.my_nametag,
    page_theme: parent.my_nametag?.theme,
    post_ids
  };
}) satisfies PageServerLoad;
