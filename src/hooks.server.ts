import type { Handle } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { Fauna } from '$lib/server/db/Fauna';

export const handle = (async ({ event, resolve }) => {
  Fauna.FAUNA_SECRET = event.platform?.env.FAUNA_SECRET || env.FAUNA_SECRET;

  return await resolve(event);
}) satisfies Handle;
