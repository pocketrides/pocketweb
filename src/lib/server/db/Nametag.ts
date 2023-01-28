import { Fauna, type FaunaRef } from './Fauna';
import { Account } from './Account';
import type { DraftNametag, ServerNametag } from '$lib/zod/Nametag';

export class Nametag {
  static collection = 'nametags';

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

  static async create(data: DraftNametag) {
    return await Fauna.create<ServerNametag>(
      Nametag.collection,
      data,
      Nametag.parseFQL
    );
  }

  static async update(id: string, data: DraftNametag) {
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
    return Fauna.parseFQL<ServerNametag>(fql, ['account_ref']);
  }

  static toRef(id: string) {
    return Fauna.toRef(Nametag.collection, id);
  }
}
