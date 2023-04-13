import type { ChatResponse } from '$lib/api/chat/chat';
import { draft_chat_validator } from '$lib/zod/Chat';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { Chat } from '$lib/server/db/Chat';

export const POST = (async (event) => {
  const payload = draft_chat_validator.safeParse(await event.request.json());
  let res: ChatResponse = { success: false };

  if (event.locals.nametag_id && payload.success) {
    const chat = await Chat.create(event.locals.nametag_id, payload.data);

    if (chat) {
      res = {
        success: true,
        chat
      };
    }
  }

  return json(res);
}) satisfies RequestHandler;
