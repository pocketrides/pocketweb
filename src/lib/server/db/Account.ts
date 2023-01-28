import { Fauna } from './Fauna';

export interface AccountData {
  id: string;
  stytch_id: string;
  terms_version?: string;
}

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

  static async getByStytchId(stytch_id: string) {
    return await Fauna.one<AccountData>(
      'accounts_by_stytch_id',
      stytch_id,
      Account.parseFQL
    );
  }

  static async create(data: Omit<AccountData, 'id'>) {
    return await Fauna.create<AccountData>(
      Account.collection,
      data,
      Account.parseFQL
    );
  }

  static async update(id: string, data: Omit<AccountData, 'id'>) {
    return await Fauna.update<AccountData>(Account.toRef(id), data);
  }

  static async delete(id: string) {
    return await Fauna.delete(Account.toRef(id));
  }

  static parseFQL(fql: any) {
    return Fauna.parseFQL<AccountData>(fql);
  }

  static toRef(id: string) {
    return Fauna.toRef(Account.collection, id);
  }
}
