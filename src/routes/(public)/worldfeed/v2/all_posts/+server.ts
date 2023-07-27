import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { Fauna, q } from '$lib/server/db/Fauna';
import { Post } from '$lib/server/db/Post';
import type { ServerPost } from '$lib/zod/Post';
import type { Searchable } from '$lib/zod/Algolia';

export const GET = (async (event) => {
  const res: any = await Fauna.client().query(
    q.Map(
      q.Paginate(q.Documents(q.Collection('posts')), { size: 5000 }),
      q.Lambda('post_ref', q.Get(q.Var('post_ref')))
    )
  );

  let posts: Searchable<ServerPost>[] = [];

  res.data.forEach((p: any) => {
    let post = Post.parseFQL(p);

    posts.push({
      objectID: post.id,
      ...post
    });
  });

  return json(posts);
}) satisfies RequestHandler;
