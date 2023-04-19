import { client_chat_validator, type DraftChat } from '$lib/zod/Chat';
import { z } from 'zod';
import { Api } from '../api';

export class ChatRequest {
  static endpoint = '/_/chat';

  static response_validator = z.object({
    success: z.boolean(),
    chat: client_chat_validator.optional()
  });

  static async post(draft: DraftChat) {
    return (await Api.post(
      this.endpoint,
      draft,
      this.response_validator
    )) as ChatResponse;
  }
}

export type ChatResponse = z.infer<typeof ChatRequest.response_validator>;
