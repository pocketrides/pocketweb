import { z } from 'zod';
import { Api } from '../api';

export class NametagUse {
  static endpoint = '/_/nametag/use';

  static payload = z.object({ nametag_id: z.string() });

  static response = Api.generic_response;

  static async post(payload: NametagUsePayload) {
    return await Api.post<NametagUseResponse>(
      NametagUse.endpoint,
      payload,
      NametagUse.response
    );
  }
}

export type NametagUsePayload = z.infer<typeof NametagUse.payload>;
export type NametagUseResponse = z.infer<typeof NametagUse.response>;
