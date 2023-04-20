import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import type { RetrieveRepliesRequestResponse } from '$lib/api/reply/retrieve';
import { Reply } from '$lib/server/db/Reply';

export const GET = (async (event) => {
  const post_id = event.params.id;

  let res: RetrieveRepliesRequestResponse = {
    replies: await Reply.retrieve(post_id, event.locals.nametag_id)
  };

  return json(res);
}) satisfies RequestHandler;
