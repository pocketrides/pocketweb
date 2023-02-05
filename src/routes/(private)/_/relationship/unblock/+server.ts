import {
  UnblockRequest,
  type UnblockRequestResponse
} from '$lib/api/relationships/unblock';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { Relationship } from '$lib/server/db/Relationship';

export const POST = (async (event) => {
  const payload = UnblockRequest.payload.safeParse(await event.request.json());
  let response: UnblockRequestResponse = { success: false };

  if (payload.success && event.locals.nametag_id) {
    await Relationship.unblock(
      event.locals.nametag_id,
      payload.data.target_nametag_id
    );

    response = { success: true };
  }

  return json(response);
}) satisfies RequestHandler;
