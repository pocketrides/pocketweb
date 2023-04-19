import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { Chat } from '$lib/server/db/Chat';

export const load = (async (event) => {
  const parent = await event.parent();

  if (!parent.my_membership || parent.pocket.settings.joinability === 'broadcast')
    throw redirect(302, `/pocket/${parent.pocket.id}`);

  return {
    ...parent,
    chats: await Chat.list(event.params.pocket_id)
  };
}) satisfies PageServerLoad;
