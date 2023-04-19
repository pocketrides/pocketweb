import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { Pocket } from '$lib/server/db/Pocket';
import {
  UpdatePocketRequest,
  type UpdatePocketResponse
} from '$lib/api/pocket/update';

export const POST = (async (event) => {
  const payload = UpdatePocketRequest.payload_validator.safeParse(
    await event.request.json()
  );
  let res: UpdatePocketResponse = { success: false };

  if (payload.success && event.locals.nametag_id) {
    const pocket = await Pocket.safeRetrieve(
      event.locals.nametag_id,
      payload.data.pocket_id
    );

    if (pocket && Pocket.isPocketAdmin(event.locals.nametag_id, pocket))
      res = await Pocket.update(payload.data.pocket_id, payload.data.pocket);
  }

  return json(res);
}) satisfies RequestHandler;
