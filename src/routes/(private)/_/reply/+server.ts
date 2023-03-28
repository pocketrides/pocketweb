import {
  ReplyToPostRequest,
  type ReplyToPostResponse
} from '$lib/api/reply/reply_to_post';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { Reply } from '$lib/server/db/Reply';
import { Notify, TopicSubscribe } from '$lib/server/Notify';

export const POST = (async (event) => {
  let res: ReplyToPostResponse = { success: false };
  const payload = ReplyToPostRequest.payload_validator.safeParse(
    await event.request.json()
  );

  if (event.locals.nametag_id && payload.success) {
    res = await Reply.replyToPost(event.locals.nametag_id, payload.data);

    if (res.success) {
      await Notify({
        title: 'New reply',
        topic: payload.data.post_id,
        recipients: [
          {
            // @ts-ignore
            topic: {
              subscribers: true
            }
          }
        ]
      });

      await TopicSubscribe(event.locals.nametag_id, payload.data.post_id);
    }
  }

  return json(res);
}) satisfies RequestHandler;
