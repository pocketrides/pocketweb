import type { DraftQuarantine, ServerQuarantine } from '$lib/zod/Quarantine';
import { Fauna } from './Fauna';
import { Nametag } from './Nametag';
import { Post } from './Post';
import { PostStats } from './PostStats';

export class Quarantine {
  static collection = 'quarantines';

  static async doesQuarantinePost(nametag_id: string, post_id: string) {
    const exists = await Fauna.one<ServerQuarantine>(
      'is_post_quarantined',
      [Nametag.toRef(nametag_id), Post.toRef(post_id)],
      Quarantine.parseFQL
    );

    if (exists) return true;
    return false;
  }

  static async create(nametag_id: string, create: DraftQuarantine) {
    let data: Partial<ServerQuarantine> = {
      nametag_ref: Nametag.toRef(nametag_id)
    };

    if (create.post_id) data.post_ref = Post.toRef(create.post_id);
    // if (create.reply_id) data.reply_ref =
    // if (create.chat_id) data.reply_ref =

    await Fauna.create<ServerQuarantine>(
      Quarantine.collection,
      data,
      Quarantine.parseFQL
    );

    if (create.post_id) {
      await PostStats.addQuarantine(create.post_id);
    }
  }

  static async destroy(nametag_id: string, destroy: DraftQuarantine) {
    let query: ServerQuarantine | undefined;

    if (destroy.post_id) {
      query = await Fauna.one<ServerQuarantine>(
        'is_post_quarantined',
        [Nametag.toRef(nametag_id), Post.toRef(destroy.post_id)],
        Quarantine.parseFQL
      );

      await PostStats.removeQuarantine(destroy.post_id);
    }

    if (query) await Fauna.delete(Quarantine.toRef(query.id));
  }

  static toRef(id: string) {
    return Fauna.toRef(Quarantine.collection, id);
  }

  static parseFQL(fql: any) {
    return Fauna.parseFQL(fql, ['nametag_ref', 'post_ref', 'reply_ref', 'chat_ref']);
  }
}
