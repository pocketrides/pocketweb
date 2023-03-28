import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { NametagCollab } from '$lib/server/db/NametagCollab';

export const GET = (async (event) => {
  return json(await NametagCollab.list(event.locals.nametag_id!));
}) satisfies RequestHandler;
