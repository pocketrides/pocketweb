import { Like } from '$lib/server/db/Like';
import { Quarantine } from '$lib/server/db/Quarantine';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import type { PostStatsResponse } from '$lib/api/post/stats';

export const GET = (async (event) => {
  const res: PostStatsResponse = {
    is_liked: false,
    unlike_key: undefined,
    is_quarantined: false
  };

  if (event.locals.nametag_id) {
    const unlike_key = await Like.doesLikePost(
      event.locals.nametag_id,
      event.params.id
    );

    res.is_liked = typeof unlike_key === 'string';
    res.unlike_key = typeof unlike_key === 'string' ? unlike_key : undefined;
    res.is_quarantined = await Quarantine.doesQuarantinePost(
      event.locals.nametag_id,
      event.params.id
    );
  }

  return json(res);
}) satisfies RequestHandler;
