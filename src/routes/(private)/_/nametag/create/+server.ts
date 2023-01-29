import { NametagCreate, type NametagCreateResponse } from '$lib/api/nametag/create';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { Nametag } from '$lib/server/db/Nametag';
import { createNametagCookie } from '$lib/server/Cookies';

export const POST = (async (event) => {
  const payload = NametagCreate.payload.safeParse(await event.request.json());
  let response: NametagCreateResponse = { success: false };

  if (payload.success) {
    const nametag = await Nametag.create(
      event.locals.fauna_account_id as string,
      payload.data
    );

    if (nametag) {
      response = { success: true, nametag_id: nametag.id };
      event.locals.nametag_id = nametag.id;
      createNametagCookie(event.cookies, nametag.id);
    }
  }

  return json(response);
}) satisfies RequestHandler;
