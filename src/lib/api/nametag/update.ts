import { draft_nametag_validator } from '$lib/zod/Nametag';
import type { z } from 'zod';
import { Api } from '../api';

export class NametagUpdate {
  static endpoint = '/_/nametag/update';

  static payload = draft_nametag_validator.partial();

  static response = Api.generic_response;

  static async post(payload: NametagUpdatePayload) {
    return await Api.post<NametagUpdateResponse>(
      NametagUpdate.endpoint,
      payload,
      NametagUpdate.response
    );
  }
}

export type NametagUpdatePayload = z.infer<typeof NametagUpdate.payload>;
export type NametagUpdateResponse = z.infer<typeof NametagUpdate.response>;
