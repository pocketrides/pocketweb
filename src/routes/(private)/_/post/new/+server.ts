import { NewPostRequest, type NewPostResponse } from '$lib/api/post/new';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { Post } from '$lib/server/db/Post';
import { OpenAI } from '$lib/server/OpenAI';

export const POST = (async (event) => {
  const payload = NewPostRequest.payload.safeParse(await event.request.json());
  let res: NewPostResponse = { success: false };

  if (payload.success) {
    const moderation_result = await OpenAI.moderate(
      payload.data.contents.map((c) => {
        return c.content_raw;
      })
    );

    if (
      moderation_result &&
      moderation_result.flags &&
      moderation_result.flags.length
    ) {
      res = {
        success: false,
        reason: 'failed_moderation',
        flags: moderation_result.flags
      };

      return json(res);
    }

    const post = await Post.create(event.locals.nametag_id as string, payload.data);

    if (post)
      res = {
        success: true,
        post_id: post.id
      };
  }

  return json(res);
}) satisfies RequestHandler;
