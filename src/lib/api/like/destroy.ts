import type { z } from 'zod';
import { Api } from '../api';
import { draft_like_payload } from '$lib/zod/Like';

export class LikeDestroyRequest {
  static endpoint = '/_/like/destroy';

  static payload = draft_like_payload;

  static response = Api.generic_response;

  static async post(payload: LikeDestroyPayload) {
    return await Api.post<LikeDestroyResponse>(
      this.endpoint,
      payload,
      this.response
    );
  }
}

export type LikeDestroyPayload = z.infer<typeof LikeDestroyRequest.payload>;
export type LikeDestroyResponse = z.infer<typeof LikeDestroyRequest.response>;
