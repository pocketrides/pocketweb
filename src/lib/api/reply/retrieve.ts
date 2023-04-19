import { client_reply_validator } from '$lib/zod/Reply';
import { z } from 'zod';

export class RetrieveRepliesRequest {
  static response = z.object({
    replies: z.array(client_reply_validator)
  });

  static async get(post_id: string) {
    const req = await fetch(`/_/post/${post_id}/replies`);
    return this.response.safeParse(await req.json());
  }
}

export type RetrieveRepliesRequestResponse = z.infer<
  typeof RetrieveRepliesRequest.response
>;
