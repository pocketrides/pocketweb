import type { z } from 'zod';
import { Api } from '../api';
import { draft_like_payload } from '$lib/zod/Like';

export class LikeCreateRequest {
  static endpoint = '/_/like/create';

  static payload = draft_like_payload;

  static response = Api.generic_response;

  static async post(payload: LikeCreatePayload) {
    return await Api.post<LikeCreateResponse>(this.endpoint, payload, this.response);
  }
}

export type LikeCreatePayload = z.infer<typeof LikeCreateRequest.payload>;
export type LikeCreateResponse = z.infer<typeof LikeCreateRequest.response>;
