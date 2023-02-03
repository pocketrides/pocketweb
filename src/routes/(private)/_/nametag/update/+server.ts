import { NametagUpdate, type NametagUpdateResponse } from '$lib/api/nametag/update';
import { Nametag } from '$lib/server/db/Nametag';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST = (async (event) => {
  const payload = NametagUpdate.payload.safeParse(await event.request.json());
  let response: NametagUpdateResponse = { success: false };

  if (payload.success) {
    const nametag = await Nametag.update(
      event.locals.nametag_id as string,
      payload.data
    );

    if (nametag) {
      response = { success: true };
    }
  }

  return json(response);
}) satisfies RequestHandler;
