import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { PocketMember } from '$lib/server/db/PocketMember';

export const GET = (async (event) => {
  return json(await PocketMember.list(event.params.pocket_id));
}) satisfies RequestHandler;
