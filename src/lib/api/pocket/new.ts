import { draft_pocket_validator } from '$lib/zod/Pocket';
import { z } from 'zod';
import { Api } from '../api';

export class NewPocketRequest {
  static endpoint = '/_/pocket/new';

  static payload_validator = draft_pocket_validator;
  static response_validator = z.object({
    success: z.boolean(),
    pocket_id: z.string().optional()
  });

  static async post(payload: NewPocketPayload) {
    return Api.post<NewPocketResponse>(
      this.endpoint,
      payload,
      this.response_validator
    );
  }
}

export type NewPocketPayload = z.infer<typeof NewPocketRequest.payload_validator>;
export type NewPocketResponse = z.infer<typeof NewPocketRequest.response_validator>;
