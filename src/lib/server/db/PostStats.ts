import { blankPostStats, type ServerPostStats } from '$lib/zod/PostStats';
import { Fauna } from './Fauna';
import { Post } from './Post';

export class PostStats {
  static collection = 'stats';

  static async getByPostId(post_id: string) {
    return await Fauna.one<ServerPostStats>(
      'stats_by_post_ref',
      Post.toRef(post_id),
      PostStats.parseFQL
    );
  }

  static async create(post_id: string, is_nsfw: boolean) {
    const data = Object.assign(blankPostStats(), {
      post_ref: Post.toRef(post_id)
    });

    data.click_to_show = is_nsfw;

    return await Fauna.create<ServerPostStats>(
      PostStats.collection,
      data,
      PostStats.parseFQL
    );
  }

  static toRef(id: string) {
    return Fauna.toRef(PostStats.collection, id);
  }

  static parseFQL(fql: any) {
    return Fauna.parseFQL(fql, ['post_ref', 'moderation_result_ref']);
  }
}
