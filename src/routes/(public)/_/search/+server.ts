import type { SearchResponse } from '$lib/api/search/search';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { z } from 'zod';
import { getCachedResponse, putCachedResponse } from '$lib/server/util/cache';
import { SearchClient } from '$lib/server/db/SearchClient';

export const GET = (async (event) => {
  const qp = await event.url.searchParams;
  let res: Response = json({
    success: false,
    nametags: [],
    pockets: []
  } as SearchResponse);

  if (qp.has('q')) {
    const parsed = z.string().min(1).max(64).safeParse(qp.get('q'));

    if (parsed.success && parsed.data) {
      const cached_res = await getCachedResponse(event);

      if (cached_res) {
        res = cached_res;
      } else {
        res = json(await SearchClient.search(parsed.data));
        putCachedResponse(event, res, 'long');
      }
    }
  }

  return res;
}) satisfies RequestHandler;
