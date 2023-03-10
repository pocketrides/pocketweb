import { Feed } from '$lib/server/db/Feed';
import type { PageServerLoad } from './$types';

export const load = (async (event) => {
  const parent = await event.parent();

  return {
    my_nametag: parent.my_nametag,
    page_theme: parent.my_nametag?.theme,
    payouts_feed: await Feed.getPayoutFeed(event.locals.nametag_id as string),
    can_create_account: parent.can_create_account,
    total_likes: parent.total_likes,
    stripe_account: parent.stripe_account,
    can_create_payouts: parent.can_create_payouts
  };
}) satisfies PageServerLoad;
