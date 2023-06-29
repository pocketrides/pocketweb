import type { DraftAccount, ServerAccount } from '$lib/zod/Account';
import { Fauna, q } from './Fauna';
import * as Sentry from '@sentry/svelte';

export class Account {
  static collection: string = 'accounts';

  static async createIfNeeded(
    stytch_id: string
  ): Promise<ServerAccount | undefined> {
    try {
      const res = await Fauna.client().query(
        q.Let(
          {
            match: q.Match(q.Index('accounts_by_stytch_id'), [stytch_id]),
            exists: q.Exists(q.Var('match'))
          },
          q.If(
            q.Var('exists'),
            q.Get(q.Var('match')),
            q.Create(q.Collection(this.collection), {
              data: {
                stytch_id
              }
            })
          )
        )
      );

      return this.parseFQL(res);
    } catch (e) {
      Sentry.captureException(e);
      console.error('account/createIfNeeded', e);

      return undefined;
    }
    // const exists = await Account.getByStytchId(stytch_id);

    // if (exists) {
    //   return exists;
    // } else {
    //   const created = await Account.create({
    //     stytch_id: stytch_id
    //   });

    //   if (created) return created;
    //   else return undefined;
    // }
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
