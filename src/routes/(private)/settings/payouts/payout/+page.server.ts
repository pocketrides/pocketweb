import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async (event) => {
  const parent = await event.parent();

  if (!parent.payouts_enabled) throw error(404);

  return {
    my_nametag: parent.my_nametag,
    page_theme: parent.my_nametag?.theme,
    payouts_enabled: parent.payouts_enabled
  };
}) satisfies PageServerLoad;
