import type { ServerTerms } from '$lib/zod/Terms';
import { Fauna, q } from './Fauna';

export class Terms {
  static collection = 'terms';

  static async getLatestVersion() {
    return await Fauna.client().query<ServerTerms>(
      q.Let(
        { terms: q.Get(q.Match(q.Index('terms_by_latest_version'))) },
        {
          version: q.Select(['data', 'version'], q.Var('terms')),
          summary: q.Select(['data', 'summary'], q.Var('terms')),
          text: '',
          id: ''
        }
      )
    );
    return await Fauna.one<ServerTerms>(
      'terms_by_latest_version',
      undefined,
      Terms.parseFQL
    );
  }

  static parseFQL(fql: any) {
    return Fauna.parseFQL<ServerTerms>(fql);
  }
}
