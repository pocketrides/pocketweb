import { Pocket } from '$lib/server/db/Pocket';
import type { PageServerLoad } from './$types';

export const load = (async (event) => {
  const parent = await event.parent();

  const pockets = await Pocket.list(
    parent.page_nametag.id,
    parent.is_my_profile_page
  );

  return {
    ...parent,
    ...pockets
  };
}) satisfies PageServerLoad;
