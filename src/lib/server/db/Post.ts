import type { ClientRef } from '$lib/zod/Fauna';
import type { DraftPost, ServerPost } from '$lib/zod/Post';
import { Fauna } from './Fauna';
import { Nametag } from './Nametag';
import { NametagStats } from './NametagStats';
import { PostStats } from './PostStats';

export class Post {
  static collection = 'posts';

  static async getById(post_id: string) {
    const post = await Fauna.get<ServerPost>(Post.toRef(post_id), Post.parseFQL);

    if (post) {
      const stats = await PostStats.getByPostId(post.id);

      if (stats) {
        post.stats = stats;
      }

      const nametag = await Nametag.getById((post.nametag_ref as ClientRef).id);

      if (nametag) {
        post.nametag = nametag;
      }
    }

    return post;
  }

  static async create(nametag_id: string, draft: DraftPost) {
    const data = Object.assign(draft, {
      nametag_ref: Nametag.toRef(nametag_id)
    });

    let post = await Fauna.create<ServerPost>(Post.collection, data, Post.parseFQL);

    if (post) {
      const stats = await PostStats.create(post.id, data.settings.is_nsfw);

      if (stats) {
        post = await Fauna.update<ServerPost>(
          Post.toRef(post.id),
          {
            stats_ref: PostStats.toRef(stats.id)
          },
          Post.parseFQL
        );
      }

      await NametagStats.addPost(nametag_id);
    }

    return post;
  }

  static async update(post_id: string, draft: Partial<DraftPost>) {
    return await Fauna.update<ServerPost>(Post.toRef(post_id), draft, Post.parseFQL);
  }

  static async delete(post_id: string) {
    return await Fauna.delete(Post.toRef(post_id));
  }

  static toRef(post_id: string) {
    return Fauna.toRef(Post.collection, post_id);
  }

  static parseFQL(fql: any) {
    return Fauna.parseFQL<ServerPost>(fql, ['nametag_ref', 'stats_ref']);
  }
}
