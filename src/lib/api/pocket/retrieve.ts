import { server_pocket_validator, type ServerPocket } from '$lib/zod/Pocket';
import { z } from 'zod';

export class RetrievePocketRequest {
  static validator = z.object({
    success: z.boolean(),
    pocket: server_pocket_validator.optional()
  });

  static async get(
    pocket_id: string,
    _fetch = fetch
  ): Promise<ServerPocket | undefined> {
    const req = await _fetch(`/_/pockets/${pocket_id}/retrieve`);
    const json = await req.json();
    const parsed = this.validator.safeParse(json);

    if (parsed.success && parsed.data.pocket) {
      return parsed.data.pocket;
    }

    return undefined;
  }
}
