import { Nametag } from '$lib/server/db/Nametag';
import type { LayoutServerLoad } from './$types';

export const load = (async (event) => {
  return {
    my_nametag: event.locals.nametag_id
      ? await Nametag.getById(event.locals.nametag_id as string)
      : undefined
  };
}) satisfies LayoutServerLoad;
