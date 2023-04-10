import { draft_pocket_validator } from '$lib/zod/Pocket';
import { z } from 'zod';
import { Api } from '../api';

export class UpdatePocketRequest {
  static endpoint = '/_/pocket/update';

  static payload_validator = z.object({
    pocket_id: z.string(),
    pocket: draft_pocket_validator
  });
  static response_validator = z.object({
    success: z.boolean(),
    pocket_id: z.string().optional()
  });

  static async post(payload: UpdatePocketPayload) {
    return Api.post<UpdatePocketResponse>(
      this.endpoint,
      payload,
      this.response_validator
    );
  }
}

export type UpdatePocketPayload = z.infer<
  typeof UpdatePocketRequest.payload_validator
>;
export type UpdatePocketResponse = z.infer<
  typeof UpdatePocketRequest.response_validator
>;
