import { Fauna } from './Fauna';

export class PostStats {
  static collection = 'post_stats';

  static getByPostId(post_id: string) {
    return (await Fauna.one) < ServerPostStats;
  }
}
