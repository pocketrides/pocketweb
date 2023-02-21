import { draft_post_validator } from '$lib/zod/Post';
import { z } from 'zod';
import { Api } from '../api';

export class NewPostRequest {
  static endpoint = '/_/post/new';

  static payload = draft_post_validator;

  static response = z.object({
    success: z.boolean(),
    post_id: z.string().optional(),
    reason: z.enum(['failed_moderation']).optional(),
    flags: z.array(z.string()).optional()
  });

  static async post(payload: NewPostPayload): Promise<NewPostResponse> {
    return await Api.post<NewPostResponse>(
      NewPostRequest.endpoint,
      payload,
      NewPostRequest.response
    );
  }
}

export type NewPostPayload = z.infer<typeof NewPostRequest.payload>;
export type NewPostResponse = z.infer<typeof NewPostRequest.response>;
