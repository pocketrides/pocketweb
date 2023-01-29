import type { DraftAccount, ServerAccount } from '$lib/zod/Account';
import { Fauna } from './Fauna';

export class Account {
  static collection: string = 'accounts';

  static async createIfNeeded(stytch_id: string): Promise<string | undefined> {
    const exists = await Account.getByStytchId(stytch_id);

    if (exists) {
      return exists.id;
    } else {
      const created = await Account.create({
        stytch_id: stytch_id
      });

      if (created) return created.id;
      else return undefined;
    }
  }

  static async getByFaunaId(fauna_id: string) {
    return await Fauna.one<ServerAccount>(
      'accounts_by_fauna_id',
      fauna_id,
      Account.parseFQL
    );
  }

  static async getByStytchId(stytch_id: string) {
    return await Fauna.one<ServerAccount>(
      'accounts_by_stytch_id',
      stytch_id,
      Account.parseFQL
    );
  }

  static async create(data: DraftAccount) {
    return await Fauna.create<ServerAccount>(
      Account.collection,
      data,
      Account.parseFQL
    );
  }

  static async update(id: string, data: Partial<DraftAccount>) {
    return await Fauna.update<ServerAccount>(
      Account.toRef(id),
      data,
      Account.parseFQL
    );
  }

  static async delete(id: string) {
    return await Fauna.delete(Account.toRef(id));
  }

  static parseFQL(fql: any) {
    return Fauna.parseFQL<ServerAccount>(fql);
  }

  static toRef(id: string) {
    return Fauna.toRef(Account.collection, id);
  }
}
