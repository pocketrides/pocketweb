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

  static async addLike(post_id: string) {
    const stats = await this.getByPostId(post_id);
    if (stats) {
      await Fauna.update<ServerPostStats>(
        this.toRef(stats.id),
        {
          likes: stats.likes + 1
        },
        this.parseFQL
      );
    }
  }

  static async removeLike(post_id: string) {
    const stats = await this.getByPostId(post_id);
    if (stats) {
      await Fauna.update<ServerPostStats>(
        this.toRef(stats.id),
        {
          likes: stats.likes - 1
        },
        this.parseFQL
      );
    }
  }

  static async addQuarantine(post_id: string) {
    const stats = await this.getByPostId(post_id);
    if (stats) {
      await Fauna.update<ServerPostStats>(
        this.toRef(stats.id),
        { quarantines: stats.quarantines + 1 },
        this.parseFQL
      );
    }
  }

  static async removeQuarantine(post_id: string) {
    const stats = await this.getByPostId(post_id);
    if (stats) {
      await Fauna.update<ServerPostStats>(
        this.toRef(stats.id),
        { quarantines: stats.quarantines - 1 },
        this.parseFQL
      );
    }
  }

  static toRef(id: string) {
    return Fauna.toRef(PostStats.collection, id);
  }

  static parseFQL(fql: any) {
    return Fauna.parseFQL<ServerPostStats>(fql, ['post_ref']);
  }
}
