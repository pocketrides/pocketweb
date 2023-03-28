import { server_nametag_validator, type ServerNametag } from '$lib/zod/Nametag';
import { z } from 'zod';
import { Api } from '../api';
import {
  client_nametag_collab_validator,
  type ClientNametagCollab
} from '$lib/zod/NametagCollab';

export class NametagList {
  static endpoint = '/_/nametag/list';

  static response = z.discriminatedUnion('success', [
    z.object({
      success: z.literal(true),
      nametags: z.array(server_nametag_validator),
      collabs: z.array(client_nametag_collab_validator)
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
  | { success: true; nametags: ServerNametag[]; collabs: ClientNametagCollab[] };
