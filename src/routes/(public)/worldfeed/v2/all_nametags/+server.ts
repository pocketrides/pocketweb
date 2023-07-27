import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { Fauna, q } from '$lib/server/db/Fauna';
import { Post } from '$lib/server/db/Post';
import type { ServerPost } from '$lib/zod/Post';
import { Nametag } from '$lib/server/db/Nametag';
import type { ClientNametag } from '$lib/zod/Nametag';
import type { Searchable } from '$lib/zod/Algolia';

export const GET = (async (event) => {
  const res = await Fauna.client().query<{ data: ClientNametag[] }>(
    q.Map(
      q.Paginate(q.Documents(q.Collection('nametags')), { size: 5000 }),
      q.Lambda(
        'nametag_ref',
        q.Let(
          {
            nametag: q.Get(q.Var('nametag_ref'))
          },
          Nametag.fql_for.client_nametag()
        )
      )
    )
  );

  let nametags: Searchable<ClientNametag>[] = [];

  res.data.forEach((p) => nametags.push({ ...p, objectID: p.id }));

  return json(nametags);
}) satisfies RequestHandler;
