import { z } from 'zod';
import { Api } from '../api';

export class LikeCreate {
  static endpoint = '/_/like';

  static payload = z.object({
    post_id: z.string().optional(),
    reply_id: z.string().optional(),
    chat_id: z.string().optional()
  });

  static response = z.discriminatedUnion('success', [
    z.object({
      success: z.literal(true)
    }),
    z.object({
      success: z.literal(false)
    })
  ]);

  static async post(payload: LikeCreatePayload) {
    return await Api.post(LikeCreate.endpoint, payload, LikeCreate.response);
  }
}

export type LikeCreatePayload = z.infer<typeof LikeCreate.payload>;
export type LikeCreateResponse = z.infer<typeof LikeCreate.response>;
