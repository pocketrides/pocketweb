import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getCachedResponse, putCachedResponse } from '$lib/server/util/cache';
import { Post } from '$lib/server/db/Post';
import { Relationship } from '$lib/server/db/Relationship';
import type { ClientRef } from '$lib/zod/Fauna';

const error_response = json({}, { status: 404 });

export const GET = (async (event) => {
  let response = await getCachedResponse(event);

  if (!response) {
    const post = await Post.getById(event.params.id);

    if (post) {
      if (post.audience === 'close_friends') {
        if (event.locals.nametag_id) {
          const is_close_friend = await Relationship.isCloseFriend(
            (post.nametag_ref as ClientRef).id,
            event.locals.nametag_id as string
          );

          if (is_close_friend) {
            response = json(post);
          } else {
            response = error_response.clone();
          }
        } else {
          response = error_response.clone();
        }
      } else {
        response = json(post);
        putCachedResponse(event, response, 'short');
      }
    } else {
      response = error_response.clone();
    }
  }

  return response;
}) satisfies RequestHandler;
