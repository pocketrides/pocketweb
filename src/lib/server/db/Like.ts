import type { DraftLike, ServerLike } from '$lib/zod/Like';
import { Account } from './Account';
import { Fauna, q } from './Fauna';
import { Invoice } from './Invoice';

export class Like {
  static mint_count = 250;
  static collection = 'likes';

  static async nextAvailable(account_id: string) {
    return await Fauna.one<ServerLike>(
      'likes_by_account_ref_and_availability',
      [Account.toRef(account_id), true],
      Like.parseFQL
    );
  }

  static async assign(account_id: string, draft: DraftLike) {
    const next_available = await Like.nextAvailable(account_id);

    if (next_available) {
      const data = {};
    }
  }

  static async mint(account_id: string, invoice_id: string) {
    const invoice = await Invoice.getById(invoice_id);

    if (invoice === undefined) {
      return false;
    }

    if (invoice.minted) {
      return true;
    }

    const likes_to_mint = [];

    for (let i = 0; i < Like.mint_count; i++) {
      likes_to_mint.push({
        account_ref: Account.toRef(account_id),
        invoice_ref: Invoice.toRef(invoice_id),
        available: true
      });
    }

    try {
      await Fauna.client().query(
        q.Foreach(
          likes_to_mint,
          q.Lambda(
            'like',
            q.Create(q.Collection(Like.collection), { data: q.Var('like') })
          )
        )
      );

      await Invoice.update(invoice_id, { minted: true });

      return true;
    } catch (e) {
      return false;
    }
  }

  static toRef(id: string) {
    return Fauna.toRef(Like.collection, id);
  }

  static parseFQL(fql: any) {
    return Fauna.parseFQL(fql, [
      'account_ref',
      'invoice_ref',
      'post_ref',
      'reply_ref',
      'chat_ref'
    ]);
  }
}
