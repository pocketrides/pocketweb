import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { Fauna, q } from '$lib/server/db/Fauna';
import { Post } from '$lib/server/db/Post';
import type { ServerPost } from '$lib/zod/Post';
import { Pocket, type GetPocketQueryResponse } from '$lib/server/db/Pocket';
import type { ServerPocket } from '$lib/zod/Pocket';
import type { Searchable } from '$lib/zod/Algolia';

export const GET = (async (event) => {
  const res = await Fauna.client().query<{ data: GetPocketQueryResponse[] }>(
    q.Map(
      q.Paginate(q.Documents(q.Collection('pockets')), { size: 500 }),
      q.Lambda('pocket_ref', Pocket.fql_for.get_pocket())
    )
  );

  let pockets: Searchable<ServerPocket>[] = [];

  res.data.forEach((p) => {
    if (p.success) {
      let pocket = Pocket.parseFQL(p.pocket, p.nametag, p.hosts, p.members_count[0]);
      pockets.push({
        objectID: pocket.id,
        ...pocket
      });
    }
  });

  return json(pockets);
}) satisfies RequestHandler;
