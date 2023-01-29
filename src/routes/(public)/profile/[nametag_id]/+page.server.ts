import { Nametag } from '$lib/server/db/Nametag';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async (event) => {
  const nametag = await Nametag.getById(event.params.nametag_id);

  if (!nametag) throw error(404);

  const parent = await event.parent();

  return {
    my_nametag: parent.my_nametag,
    page_theme: nametag.theme
  };
}) satisfies PageServerLoad;
