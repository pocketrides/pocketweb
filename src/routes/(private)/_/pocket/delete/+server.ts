import { json } from '@sveltejs/kit';
import {
  DeletePocketRequest,
  type DeletePocketResponse
} from '$lib/api/pocket/delete';
import type { RequestHandler } from './$types';
import { Pocket } from '$lib/server/db/Pocket';

export const POST = (async (event) => {
  const payload = DeletePocketRequest.payload_validator.safeParse(
    await event.request.json()
  );
  let res: DeletePocketResponse = { success: false };

  if (payload.success && event.locals.nametag_id) {
    res = await Pocket.delete(event.locals.nametag_id, payload.data.pocket_id);
  }

  return json(res);
}) satisfies RequestHandler;
