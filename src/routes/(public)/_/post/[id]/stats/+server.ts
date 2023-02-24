import { Like } from '$lib/server/db/Like';
import { Quarantine } from '$lib/server/db/Quarantine';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET = (async (event) => {
  const res = {
    is_liked: false,
    is_quarantined: false
  };

  if (event.locals.nametag_id) {
    res.is_liked = await Like.doesLikePost(event.locals.nametag_id, event.params.id);
    res.is_quarantined = await Quarantine.doesQuarantinePost(
      event.locals.nametag_id,
      event.params.id
    );
  }

  return json(res);
}) satisfies RequestHandler;
