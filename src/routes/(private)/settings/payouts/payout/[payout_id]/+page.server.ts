import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { Payout } from '$lib/server/db/Payout';

export const load = (async (event) => {
  const parent = await event.parent();

  const payout = await Payout.retrieve(
    event.params.payout_id,
    event.locals.nametag_id!
  );

  if (!payout) throw error(404);

  return {
    my_nametag: parent.my_nametag,
    page_theme: parent.my_nametag?.theme,
    can_create_account: parent.can_create_account,
    payout
  };
}) satisfies PageServerLoad;
