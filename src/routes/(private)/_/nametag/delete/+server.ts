import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { Nametag } from '$lib/server/db/Nametag';
import type { ApiGenericResponse } from '$lib/api/api';
import { NametagStats } from '$lib/server/db/NametagStats';
import { StripeClient } from '$lib/server/StripeClient';
import { destroySessionCookie } from '$lib/server/cookies';
import { Post } from '$lib/server/db/Post';
import { Relationship } from '$lib/server/db/Relationship';

export const POST = (async (event) => {
  let res: ApiGenericResponse = { success: false };

  if (event.locals.nametag_id && event.locals.nametag) {
    try {
      let promises = [
        Nametag.delete(event.locals.nametag_id),
        NametagStats.delete(event.locals.nametag.stats_ref?.id),
        StripeClient.destroy(event.locals.nametag.stripe?.cus_id),
        Post.deleteAll(event.locals.nametag_id)
      ];

      if (event.platform) {
        promises.push(
          Relationship.removeAll(event.platform, event.locals.nametag_id)
        );
      }

      await Promise.all(promises);

      destroySessionCookie(event.cookies);

      res = { success: true };
    } catch (e) {
      console.error('nametag/delete/+server', e);
    }
  }

  return json(res);
}) satisfies RequestHandler;
