import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { Pocket } from '$lib/server/db/Pocket';
import type { AddPostToListResponse } from '$lib/api/post/add_to';
import type { ApiGenericResponse } from '$lib/api/api';

export const GET = (async (event) => {
  let list: AddPostToListResponse = {
    pockets: [],
    cohosted_pockets: [],
    unlisted_pockets: [],
    joined_pockets: []
  };

  if (event.locals.nametag) {
    list = await Pocket.list(event.locals.nametag.id, true, true);
  }
  return json(list);
}) satisfies RequestHandler;

export const POST = async (event) => {
  let res: ApiGenericResponse = { success: false };

  return json(res);
};
