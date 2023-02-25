import { NewPostRequest, type NewPostResponse } from '$lib/api/post/new';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { Post } from '$lib/server/db/Post';
import { OpenAI } from '$lib/server/OpenAI';

export const POST = (async (event) => {
  const payload = NewPostRequest.payload.safeParse(await event.request.json());
  let res: NewPostResponse = { success: false };

  if (payload.success) {
    if (payload.data.settings.enable_likes === true) {
      const mod_result = await OpenAI.moderate(
        payload.data.contents.map((c) => c.content_raw)
      );

      if (mod_result) {
        payload.data.settings.mod_result = mod_result;
      }

      if (mod_result && mod_result.allow_likes === false) {
        payload.data.settings.enable_likes = false;
      }
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
