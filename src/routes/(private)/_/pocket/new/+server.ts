import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { Pocket } from '$lib/server/db/Pocket';
import { NewPocketRequest, type NewPocketResponse } from '$lib/api/pocket/new';

export const POST = (async (event) => {
  const payload = NewPocketRequest.payload_validator.safeParse(
    await event.request.json()
  );
  let res: NewPocketResponse = { success: false };

  if (payload.success && event.locals.nametag_id) {
    res = await Pocket.create(event.locals.nametag_id, payload.data);
    console.log('>> success', res);
  }

  return json(res);
}) satisfies RequestHandler;
