import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { unlike_item_payload_validator } from '$lib/zod/Like';
import type { ApiGenericResponse } from '$lib/api/api';
import { Like } from '$lib/server/db/Like';

export const POST = (async (event) => {
  const payload = unlike_item_payload_validator.safeParse(
    await event.request.json()
  );
  let response: ApiGenericResponse = { success: false };

  if (payload.success && payload.data.unlike_key) {
    response = {
      success: await Like.unlike(payload.data.unlike_key)
    };
  }

  return json(response);
}) satisfies RequestHandler;
