import type { NewPocketMemberResponse } from '$lib/api/pocket/members/new';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { PocketMember } from '$lib/server/db/PocketMember';

export const POST = (async (event) => {
  let res: NewPocketMemberResponse = { success: false };

  if (event.locals.nametag && event.locals.nametag_id) {
    if (event.locals.nametag.stripe?.has_sub === true) {
      res = {
        success: await PocketMember.createMember(
          event.params.pocket_id,
          event.locals.nametag_id
        )
      };
    } else {
      const can_join = await PocketMember.canFreeNametagJoin(
        event.locals.nametag_id
      );

      if (can_join) {
        res = {
          success: await PocketMember.createMember(
            event.params.pocket_id,
            event.locals.nametag_id
          )
        };
      } else {
        res = {
          success: false,
          reason: 'max_free'
        };
      }
    }
  }

  return json(res);
}) satisfies RequestHandler;
