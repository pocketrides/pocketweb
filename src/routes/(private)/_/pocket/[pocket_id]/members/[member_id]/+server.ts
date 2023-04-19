import {
  PocketMemberAdminAction,
  type PocketMemberAdminActionResponse
} from '$lib/api/pocket/members/admin_actions';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { Pocket } from '$lib/server/db/Pocket';
import { PocketMember } from '$lib/server/db/PocketMember';

// admin actions for pockets
export const POST = (async (event) => {
  const payload = PocketMemberAdminAction.payload_validator.safeParse(
    await event.request.json()
  );
  let res: PocketMemberAdminActionResponse = { success: false, member: undefined };

  if (event.locals.nametag_id && payload.success) {
    const pocket = await Pocket.safeRetrieve(
      event.locals.nametag_id,
      payload.data.pocket_id
    );

    if (pocket) {
      res = {
        success: true,
        member: await PocketMember.updateStatus(
          payload.data.member_id,
          payload.data.new_status
        )
      };
    }
  }

  return json(res);
}) satisfies RequestHandler;
