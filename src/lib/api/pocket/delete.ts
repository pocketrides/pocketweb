import { z } from 'zod';
import { Api } from '../api';

export class DeletePocketRequest {
  static endpoint = '/_/pocket/delete';

  static payload_validator = z.object({
    pocket_id: z.string()
  });

  static response_validator = z.object({
    success: z.boolean()
  });

  static async post(payload: DeletePocketPayload) {
    return Api.post<DeletePocketResponse>(
      this.endpoint,
      payload,
      this.response_validator
    );
  }
}

export type DeletePocketPayload = z.infer<
  typeof DeletePocketRequest.payload_validator
>;
export type DeletePocketResponse = z.infer<
  typeof DeletePocketRequest.response_validator
>;
