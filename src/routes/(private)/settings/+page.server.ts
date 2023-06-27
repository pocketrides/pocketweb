import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async (event) => {
  const parent = await event.parent();

  if (!parent.my_nametag) {
    throw redirect(302, `/401?p=${encodeURIComponent('/settings')}`);
  }

  return {
    my_nametag: parent.my_nametag,
    page_theme: parent.my_nametag?.theme
  };
}) satisfies PageServerLoad;
