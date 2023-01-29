import { draft_nametag_validator } from '$lib/zod/Nametag';
import { z } from 'zod';
import { Api } from '../api';

export class NametagCreate {
  static endpoint = '/_/nametag/create';

  static payload = draft_nametag_validator;

  static response = z.discriminatedUnion('success', [
    z.object({
      success: z.literal(true),
      nametag_id: z.string()
    }),
    z.object({
      success: z.literal(false)
    })
  ]);

  static async post(payload: NametagCreatePayload) {
    return await Api.post<NametagCreateResponse>(
      NametagCreate.endpoint,
      payload,
      NametagCreate.response
    );
  }
}

export type NametagCreatePayload = z.infer<typeof draft_nametag_validator>;
export type NametagCreateResponse = z.infer<typeof NametagCreate.response>;
