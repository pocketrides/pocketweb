import { EditPostRequest, type EditPostResponse } from '$lib/api/post/edit';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { Post } from '$lib/server/db/Post';
import { OpenAI } from '$lib/server/OpenAI';

export const POST = (async (event) => {
  let res: EditPostResponse = { success: false };
  const payload = EditPostRequest.payload.safeParse(await event.request.json());

  if (payload.success && event.locals.nametag_id) {
    if (payload.data.post.settings.enable_likes === true) {
      const mod_result = await OpenAI.moderate(
        payload.data.post.contents.map((c) => c.content_raw)
      );

      if (mod_result) {
        payload.data.post.settings.mod_result = mod_result;
      }

      if (mod_result && mod_result.allow_likes === false) {
        payload.data.post.settings.enable_likes = false;
        payload.data.post.settings.is_nsfw = true;

        if (payload.data.post.settings.worldfeed) {
          payload.data.post.settings.worldfeed.enabled = false;
        }
      }
    }

    const success = await Post.update(
      payload.data.edit_id,
      event.locals.nametag_id,
      payload.data.post
    );

    if (success) {
      res = {
        success: true,
        post_id: payload.data.edit_id
      };
    }
  }

  return json(res);
}) satisfies RequestHandler;
