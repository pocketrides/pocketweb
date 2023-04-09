import type { NewPocketMemberResponse } from '$lib/api/pocket/members/new';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { PocketMember } from '$lib/server/db/PocketMember';

export const POST = (async (event) => {
  let res: NewPocketMemberResponse = { success: false };

  if (event.locals.nametag_id) {
    res = {
      success: await PocketMember.createMember(
        event.params.pocket_id,
        event.locals.nametag_id
      )
    };
  }

  return json(res);
}) satisfies RequestHandler;
