import { NewPostRequest, type NewPostResponse } from '$lib/api/post/new';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { Post } from '$lib/server/db/Post';

export const POST = (async (event) => {
  const payload = NewPostRequest.payload.safeParse(await event.request.json());
  let res: NewPostResponse = { success: false };

  if (payload.success) {
    const post = await Post.create(event.locals.nametag_id as string, payload.data);

    if (post)
      res = {
        success: true,
        post_id: post.id
      };
  }

  return json(res);
}) satisfies RequestHandler;
