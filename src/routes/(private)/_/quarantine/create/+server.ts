import { Quarantine } from '$lib/server/db/Quarantine';
import {
  QuarantineCreateRequest,
  type QuarantineCreateResponse
} from '$lib/api/quarantine/create';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST = (async (event) => {
  const payload = QuarantineCreateRequest.payload.safeParse(
    await event.request.json()
  );
  let res: QuarantineCreateResponse = { success: false };

  if (payload.success && event.locals.nametag_id) {
    await Quarantine.create(event.locals.nametag_id, payload.data);
    res = { success: true };
  }

  return json(res);
}) satisfies RequestHandler;
