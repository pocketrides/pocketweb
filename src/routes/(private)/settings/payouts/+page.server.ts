import { Feed } from '$lib/server/db/Feed';
import type { PageServerLoad } from './$types';

export const load = (async (event) => {
  const parent = await event.parent();

  return {
    my_nametag: parent.my_nametag,
    page_theme: parent.my_nametag?.theme,
    payouts_feed: await Feed.getPayoutFeed(event.locals.nametag_id as string),
    payouts_enabled: parent.payouts_enabled,
    total_likes: parent.total_likes
  };
}) satisfies PageServerLoad;
