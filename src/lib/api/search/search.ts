import { client_nametag_validator, type ClientNametag } from '$lib/zod/Nametag';
import { server_pocket_validator, type ServerPocket } from '$lib/zod/Pocket';
import { z } from 'zod';

export class SearchRequest {
  static endpoint = '/_/search';

  static response_validator = z.object({
    success: z.boolean(),
    nametags: z.array(client_nametag_validator),
    pockets: z.array(server_pocket_validator)
  });

  static async search(query: string): Promise<SearchResponse> {
    if (z.string().min(1).max(64).safeParse(query).success === true) {
      const qp = new URLSearchParams();
      qp.append('q', query);

      const req = await fetch(`${this.endpoint}?${qp.toString()}`);

      const res = await req.json();
      const parsed = this.response_validator.safeParse(res);

      if (parsed.success) {
        return parsed.data;
      }
    }

    return {
      success: false,
      nametags: [],
      pockets: []
    };
  }
}

export type SearchResponse = z.infer<typeof SearchRequest.response_validator>;
