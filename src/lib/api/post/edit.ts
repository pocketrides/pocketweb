import { draft_post_validator } from '$lib/zod/Post';
import { z } from 'zod';
import { Api } from '../api';

export class EditPostRequest {
  static endpoint = '/_/post/edit';

  static payload = z.object({
    edit_id: z.string(),
    post: draft_post_validator
  });

  static response = z.object({
    success: z.boolean(),
    post_id: z.string().optional()
  });

  static async post(payload: EditPostPayload): Promise<EditPostResponse> {
    return await Api.post<EditPostResponse>(
      EditPostRequest.endpoint,
      payload,
      EditPostRequest.response
    );
  }
}

export type EditPostPayload = z.infer<typeof EditPostRequest.payload>;
export type EditPostResponse = z.infer<typeof EditPostRequest.response>;
