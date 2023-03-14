import { Fauna, q, type FaunaRef } from './Fauna';
import { Account } from './Account';
import type { ClientNametag, DraftNametag, ServerNametag } from '$lib/zod/Nametag';
import { NametagStats } from './NametagStats';
import { blankNametagStats } from '$lib/zod/NametagStats';
import { blankAccountStatus } from '$lib/zod/Stripe';

export class Nametag {
  static collection = 'nametags';

  static fql_for = {
    client_nametag: (var_name: string = 'nametag') => {
      return {
        id: q.Select(['ref', 'id'], q.Var(var_name)),
        nametag: q.Select(['data', 'nametag'], q.Var(var_name)),
        theme: q.Select(['data', 'theme'], q.Var(var_name))
      };
    }
  };

  static async verifyOwnership(
    account_id: string,
    nametag_id: string
  ): Promise<ServerNametag | undefined> {
    return await Fauna.one<ServerNametag>(
      'verify_nametag_ownership',
      [Account.toRef(account_id), nametag_id],
      Nametag.parseFQL
    );
  }

  static async getByAccountRef(account_ref: FaunaRef) {
    return await Fauna.many<ServerNametag>(
      'nametags_by_account_ref',
      account_ref,
      Nametag.parseFQL
    );
  }

  static async getById(nametag_id: string) {
    return await Fauna.get<ServerNametag>(
      Nametag.toRef(nametag_id),
      Nametag.parseFQL
    );
  }

  static async create(account_id: string, draft: Partial<DraftNametag>) {
    const data = Object.assign(draft, {
      account_ref: Account.toRef(account_id),
      stripe: blankAccountStatus()
    });

    const nametag = await Fauna.create<ServerNametag>(
      Nametag.collection,
      data,
      Nametag.parseFQL
    );

    if (nametag) {
      const stats = await NametagStats.create(nametag.id, blankNametagStats());
      if (stats)
        await Nametag.update(nametag.id, {
          stats_ref: NametagStats.toRef(stats.id)
        });
    }

    return nametag;
  }

  static async update(id: string, data: Partial<ServerNametag>) {
    return await Fauna.update<ServerNametag>(
      Nametag.toRef(id),
      data,
      Nametag.parseFQL
    );
  }

  static async delete(id: string) {
    return await Fauna.delete(Nametag.toRef(id));
  }

  static parseFQL(fql: any) {
    return Fauna.parseFQL<ServerNametag>(fql, ['account_ref', 'stats_ref']);
  }

  static parseClientFQL(fql: any): ClientNametag {
    const nametag = this.parseFQL(fql);

    return {
      id: nametag.id,
      nametag: nametag.nametag,
      theme: nametag.theme
    };
  }

  static toRef(id: string) {
    return Fauna.toRef(Nametag.collection, id);
  }
}
