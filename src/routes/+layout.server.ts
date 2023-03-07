import { MagicbellConfig } from './../lib/server/MagicbellConfig';
import type { LayoutServerLoad } from './$types';

export const load = (async (event) => {
  return {
    my_nametag: event.locals.nametag,
    mb_config: await MagicbellConfig.getConfig(event.locals.nametag_id)
  };
}) satisfies LayoutServerLoad;
