import { Api, type ApiGenericResponse } from '$lib/api/api';
import { z } from 'zod';

export class NametagCollabAddRequest {
  static payload = z.object({
    authorized_nametag_id: z.string()
  });

  static async add(authorized_nametag_id: string) {
    return Api.post<NametagCollabAddResponse>(
      `/_/nametag/collab/add`,
      {
        authorized_nametag_id
      },
      Api.generic_response
    );
  }
}

export type NametagCollabAddResponse = ApiGenericResponse;
