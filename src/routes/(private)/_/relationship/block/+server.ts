import {
  BlockRequest,
  type BlockRequestResponse
} from '$lib/api/relationships/block';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { Relationship } from '$lib/server/db/Relationship';

export const POST = (async (event) => {
  const payload = BlockRequest.payload.safeParse(await event.request.json());
  let response: BlockRequestResponse = { success: false };

  if (payload.success && event.locals.nametag_id) {
    await Relationship.block(
      event.locals.nametag_id,
      payload.data.target_nametag_id
    );

    response = { success: true };
  }

  return json(response);
}) satisfies RequestHandler;
