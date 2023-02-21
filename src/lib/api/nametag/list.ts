import { server_nametag_validator, type ServerNametag } from '$lib/zod/Nametag';
import { z } from 'zod';
import { Api } from '../api';

export class NametagList {
  static endpoint = '/_/nametag/list';

  static response = z.discriminatedUnion('success', [
    z.object({
      success: z.literal(true),
      nametags: z.array(server_nametag_validator)
    }),
    Api.generic_failure_validator
  ]);

  static async get() {
    return await Api.get<NametagListResponse>(
      NametagList.endpoint,
      NametagList.response
    );
  }
}

export type NametagListResponse =
  | { success: false }
  | { success: true; nametags: ServerNametag[] };
