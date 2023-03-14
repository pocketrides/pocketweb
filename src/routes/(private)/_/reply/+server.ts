import {
  ReplyToPostRequest,
  type ReplyToPostResponse
} from '$lib/api/reply/reply_to_post';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { Reply } from '$lib/server/db/Reply';

export const POST = (async (event) => {
  let res: ReplyToPostResponse = { success: false };
  const payload = ReplyToPostRequest.payload_validator.safeParse(
    await event.request.json()
  );

  if (event.locals.nametag_id && payload.success) {
    res = await Reply.replyToPost(event.locals.nametag_id, payload.data);
  }

  return json(res);
}) satisfies RequestHandler;
