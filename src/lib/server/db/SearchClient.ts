import type { SearchResponse } from '$lib/api/search/search';
import { Fauna, q } from './Fauna';
import { Nametag } from './Nametag';
import { Pocket, type GetPocketQueryResponse } from './Pocket';
import * as Sentry from '@sentry/svelte';

export class SearchClient {
  static async search(_q: string): Promise<SearchResponse> {
    let res: SearchResponse = {
      success: false,
      nametags: [],
      pockets: []
    };

    try {
      const query = await Fauna.client().query<{
        success: boolean;
        nametags: any[];
        pockets: GetPocketQueryResponse[];
      }>(
        q.Let(
          {
            nametags: q.Filter(
              q.Match(q.Index('search_nametags')),
              q.Lambda(
                ['n', 'r'],
                q.ContainsStr(q.LowerCase(q.Var('n')), _q.toLowerCase())
              )
            ),
            pockets: q.Filter(
              q.Match(q.Index('search_pockets'), ['listed']),
              q.Lambda(
                ['p', 'r'],
                q.ContainsStr(q.LowerCase(q.Var('p')), _q.toLowerCase())
              )
            )
          },
          {
            success: true,
            nametags: q.Select(
              ['data'],
              q.Map(
                q.Paginate(q.Var('nametags')),
                q.Lambda(['n', 'r'], q.Get(q.Var('r')))
              )
            ),
            pockets: q.Select(
              ['data'],
              q.Map(
                q.Paginate(q.Var('pockets')),
                q.Lambda(['p', 'r'], Pocket.fql_for.get_pocket('r'))
              )
            )
          }
        )
      );

      res.success = query.success;
      res.nametags = query.nametags.map((n) => Nametag.parseClientFQL(n));
      query.pockets.map((p) => {
        if (p && p.success) {
          res.pockets.push(
            Pocket.parseFQL(p.pocket, p.nametag, p.hosts, p.members_count[0])
          );
        }
      });
    } catch (e) {
      Sentry.captureException(e);

      console.error('> db/SearchClient.search()', _q, e);
    }

    return res;
  }
}
