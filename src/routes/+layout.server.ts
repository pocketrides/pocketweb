import { MagicbellConfig } from './../lib/server/MagicbellConfig';
import type { LayoutServerLoad } from './$types';

export const load = (async (event) => {
  return {
    room_key: event.locals.room_key,
    room_host: event.locals.room_host,
    my_nametag: event.locals.nametag,
    mb_config: await MagicbellConfig.getConfig(event.locals.nametag_id),
    session_expires: event.locals.session_expires,
    magic_post_id: event.locals.magic_post_id
  };
}) satisfies LayoutServerLoad;
