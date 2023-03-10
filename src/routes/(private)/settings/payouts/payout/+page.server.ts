import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async (event) => {
  const parent = await event.parent();

  if (!parent.can_create_account) throw error(404);

  return {
    my_nametag: parent.my_nametag,
    page_theme: parent.my_nametag?.theme,
    can_create_account: parent.can_create_account
  };
}) satisfies PageServerLoad;
