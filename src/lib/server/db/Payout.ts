import type { ServerPayout } from '$lib/zod/Payout';
import { Fauna } from './Fauna';
import { Like } from './Like';
import { Nametag } from './Nametag';

export class Payout {
  static collection = 'payouts';

  static async start(nametag_id: string): Promise<ServerPayout | undefined> {
    try {
      const boundary = await Like.getPayoutBoundary(nametag_id);

      if (boundary) {
        return await Fauna.create<ServerPayout>(
          this.collection,
          {
            nametag_ref: Nametag.toRef(nametag_id),
            status: 'started',
            first_like_ref: boundary.first_like_ref,
            last_like_ref: boundary.last_like_ref,
            count: boundary.count,
            is_exact: boundary.is_exact
          },
          this.parseFQL
        );
      }

      return undefined;
    } catch (e) {
      return undefined;
    }
  }

  static async get(payout_id: string): Promise<ServerPayout | undefined> {
    try {
      return await Fauna.get<ServerPayout>(this.toRef(payout_id), this.parseFQL);
    } catch (e) {
      return undefined;
    }
  }

  static toRef(id: string) {
    return Fauna.toRef(this.collection, id);
  }

  static parseFQL(fql: any) {
    return Fauna.parseFQL<ServerPayout>(fql, [
      'nametag_ref',
      'first_like_ref',
      'last_like_ref'
    ]);
  }
}
