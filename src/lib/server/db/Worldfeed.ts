import { Fauna, q } from './Fauna';

export type WorldfeedListResult = {
  post_ids: string[];
  pocket_ids: string[];
};

export class Worldfeed {
  static async list(
    city?: string,
    state?: string,
    country?: string
  ): Promise<WorldfeedListResult> {
    try {
      const query = await Fauna.client().query<WorldfeedListResult>(
        q.Let(
          {
            posts_set: q.Range(
              q.Match(q.Index('worldfeed_posts'), ['friends', true, true]),
              q.ToMicros(q.TimeSubtract(q.Now(), 30, 'days')),
              []
            ),
            filtered_set: q.Filter(
              q.Var('posts_set'),
              q.Lambda(
                ['ts', 'post_ref', 'stats_ref', 'city', 'state', 'country'],
                q.And(
                  q.ContainsStr(
                    q.If(q.IsNull(q.Var('city')), '', q.LowerCase(q.Var('city'))),
                    city?.toLowerCase() || ''
                  ),
                  q.ContainsStr(
                    q.If(q.IsNull(q.Var('state')), '', q.LowerCase(q.Var('state'))),
                    state?.toLowerCase() || ''
                  ),
                  q.ContainsStr(
                    q.If(
                      q.IsNull(q.Var('country')),
                      '',
                      q.LowerCase(q.Var('country'))
                    ),
                    country?.toLowerCase() || ''
                  )
                )
              )
            ),
            sorted_set: q.Join(
              q.Var('filtered_set'),
              q.Lambda(
                ['ts', 'post_ref', 'stats_ref', 'city', 'state', 'country'],
                q.Match(q.Index('worldfeed_stats_by_like_count'), [
                  q.Var('stats_ref')
                ])
              )
            ),
            pockets_set: q.Range(
              q.Match(q.Index('worldfeed_pockets'), [true]),
              q.ToMicros(q.TimeSubtract(q.Now(), 30, 'days')),
              []
            ),
            filtered_pockets_set: q.Filter(
              q.Var('pockets_set'),
              q.Lambda(
                ['ts', 'pocket_ref', 'city', 'state', 'country'],
                q.And(
                  q.ContainsStr(
                    q.LowerCase(q.Var('city')),
                    city?.toLowerCase() || ''
                  ),
                  q.ContainsStr(
                    q.LowerCase(q.Var('state')),
                    state?.toLowerCase() || ''
                  ),
                  q.ContainsStr(
                    q.LowerCase(q.Var('country')),
                    country?.toLowerCase() || ''
                  )
                )
              )
            )
          },
          {
            post_ids: q.Reverse(
              q.Select(
                ['data'],
                q.Map(
                  q.Paginate(q.Var('sorted_set'), {
                    size: 100
                  }),
                  q.Lambda(
                    ['like_count', 'post_ref', 'stats_ref'],
                    q.Select(['id'], q.Var('post_ref'))
                  )
                )
              )
            ),
            pocket_ids: q.Reverse(
              q.Select(
                ['data'],
                q.Map(
                  q.Paginate(q.Var('filtered_pockets_set'), {
                    size: 50
                  }),
                  q.Lambda(
                    ['ts', 'pocket_ref', '_', '_', '_'],
                    q.Select(['id'], q.Var('pocket_ref'))
                  )
                )
              )
            ),
            filtered: q.Select(['data'], q.Paginate(q.Var('filtered_set')))
          }
        )
      );

      return query;
    } catch (e) {
      console.error('db/Worldfeed.list()', e);
      return {
        post_ids: [],
        pocket_ids: []
      };
    }
  }
}
