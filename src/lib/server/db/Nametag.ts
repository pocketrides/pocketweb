import { Fauna, type Ref } from './Fauna';
import type { ThemeValue } from '$lib/zod/Theme';
import { Account } from './Account';

export interface NametagData {
  id: string;
  account_ref: { id: string } | Ref;
  nametag: string;
  theme: ThemeValue;
}

export class Nametag {
  static collection = 'nametags';

  static async verifyOwnership(
    account_id: string,
    nametag_id: string
  ): Promise<NametagData | undefined> {
    return await Fauna.one<NametagData>(
      'verify_nametag_ownership',
      [Account.toRef(account_id), nametag_id],
      Nametag.parseFQL
    );
  }

  static async getByAccountRef(account_ref: Ref) {
    return await Fauna.many<NametagData>(
      'nametags_by_account_ref',
      account_ref,
      Nametag.parseFQL
    );
  }

  static async create(data: Omit<NametagData, 'id'>) {
    return await Fauna.create<NametagData>(
      Nametag.collection,
      data,
      Nametag.parseFQL
    );
  }

  static async update(id: string, data: Omit<NametagData, 'id'>) {
    return await Fauna.update<NametagData>(Nametag.toRef(id), data);
  }

  static async delete(id: string) {
    return await Fauna.delete(Nametag.toRef(id));
  }

  static parseFQL(fql: any) {
    return Fauna.parseFQL<NametagData>(fql, ['account_ref']);
  }

  static toRef(id: string) {
    return Fauna.toRef(Nametag.collection, id);
  }
}
