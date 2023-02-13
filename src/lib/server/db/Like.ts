import type { DraftLike, ServerLike } from '$lib/zod/Like';
import { Account } from './Account';
import { Fauna, q } from './Fauna';
import { Invoice } from './Invoice';
import { Nametag } from './Nametag';
import { Post } from './Post';
import { PostStats } from './PostStats';

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

  static async doesLikePost(nametag_id: string, post_id: string) {
    const exists = await Fauna.one(
      'is_post_liked',
      [Nametag.toRef(nametag_id), Post.toRef(post_id)],
      Like.parseFQL
    );

    if (exists) return true;
    return false;
  }

  static async assign(account_id: string, draft: DraftLike) {
    const next_available = await Like.nextAvailable(account_id);

    if (next_available) {
      let data: Partial<ServerLike> = {
        nametag_ref: Nametag.toRef(draft.nametag_id),
        available: false
      };

      if (draft.post_id) {
        data.post_ref = Post.toRef(draft.post_id);

        await PostStats.addLike(draft.post_id);
      }
      // if (draft.chat_id) data.chat_ref =
      // if (draft.reply_id) data.reply_ref =

      await Fauna.update<ServerLike>(
        this.toRef(next_available.id),
        data,
        this.parseFQL
      );

      return true;
    }

    return false;
  }

  static async unassign(draft: DraftLike) {
    let query: ServerLike | undefined;

    if (draft.post_id) {
      query = await Fauna.one<ServerLike>(
        'is_post_liked',
        [Nametag.toRef(draft.nametag_id), Post.toRef(draft.post_id)],
        this.parseFQL
      );

      if (query) await PostStats.removeLike(draft.post_id);
    }

    if (query) {
      let data: Partial<ServerLike> = { nametag_ref: null, available: true };

      if (draft.post_id) data.post_ref = null;
      if (draft.chat_id) data.chat_ref = null;
      if (draft.reply_id) data.reply_ref = null;

      await Fauna.update<ServerLike>(this.toRef(query.id), data, this.parseFQL);

      return true;
    }

    return false;
  }

  static async mint(account_id: string, invoice_id: string) {
    const invoice = await Invoice.getById(invoice_id);

    if (invoice === undefined) {
      return false;
    }

    if (invoice.minted) {
      return true;
    }

    const likes_to_mint: Partial<ServerLike>[] = [];

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
      'nametag_ref',
      'post_ref',
      'reply_ref',
      'chat_ref'
    ]);
  }
}
