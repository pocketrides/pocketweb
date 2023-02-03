import { blankPostStats, type DraftPost, type ServerPost } from '$lib/zod/Post';
import { Fauna } from './Fauna';
import { Nametag } from './Nametag';

export class Post {
  static collection = 'posts';

  static async getById(post_id: string) {
    return await Fauna.get<ServerPost>(Post.toRef(post_id), Post.parseFQL);
  }

  static async create(nametag_id: string, draft: DraftPost) {
    const data = Object.assign(draft, {
      nametag_ref: Nametag.toRef(nametag_id),
      stats: blankPostStats()
    });

    return await Fauna.create(Post.collection, data, Post.parseFQL);
  }

  static async update(post_id: string, draft: DraftPost) {
    return await Fauna.update<ServerPost>(Post.toRef(post_id), draft, Post.parseFQL);
  }

  static async delete(post_id: string) {
    return await Fauna.delete(Post.toRef(post_id));
  }

  static toRef(post_id: string) {
    return Fauna.toRef(Post.collection, post_id);
  }

  static parseFQL(fql: any) {
    return Fauna.parseFQL<ServerPost>(fql, ['nametag_ref']);
  }
}
