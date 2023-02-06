import { Nametag } from '$lib/server/db/Nametag';
import type { LayoutServerLoad } from './$types';
import { getConfig } from '$lib/util/magicbell';

export const load = (async (event) => {
  return {
    my_nametag: event.locals.nametag_id
      ? await Nametag.getById(event.locals.nametag_id as string)
      : undefined,
    mb_config: await getConfig(
      event.locals.mb_api_key,
      event.locals.mb_api_secret,
      event.locals.nametag_id
    )
  };
}) satisfies LayoutServerLoad;
