import { Quarantine } from '$lib/server/db/Quarantine';
import {
  QuarantineDestroyRequest,
  type QuarantineDestroyResponse
} from '$lib/api/quarantine/destroy';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST = (async (event) => {
  const payload = QuarantineDestroyRequest.payload.safeParse(
    await event.request.json()
  );
  let res: QuarantineDestroyResponse = { success: false };

  if (payload.success && event.locals.nametag_id) {
    await Quarantine.destroy(event.locals.nametag_id, payload.data);
    res = { success: true };
  }

  return json(res);
}) satisfies RequestHandler;
