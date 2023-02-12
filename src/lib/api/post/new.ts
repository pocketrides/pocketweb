import { draft_post_validator } from '$lib/zod/Post';
import { z } from 'zod';
import { Api } from '../api';

export class NewPostRequest {
  static endpoint = '/_/post/new';

  static payload = draft_post_validator;

  static response = z.discriminatedUnion('success', [
    z.object({
      success: z.literal(true),
      post_id: z.string()
    }),
    Api.generic_failure_validator
  ]);

  static async post(payload: NewPostPayload) {
    return await Api.post<NewPostResponse>(
      NewPostRequest.endpoint,
      payload,
      NewPostRequest.response
    );
  }
}

export type NewPostPayload = z.infer<typeof NewPostRequest.payload>;
export type NewPostResponse = z.infer<typeof NewPostRequest.response>;
