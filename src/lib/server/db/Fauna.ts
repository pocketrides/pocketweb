import * as faunadb from 'faunadb';
import * as Sentry from '@sentry/svelte';

export const q = faunadb.query;

export type FaunaRef = faunadb.Expr;

export class Fauna {
  static FAUNA_SECRET: string;

  static client() {
    return new faunadb.Client({ secret: Fauna.FAUNA_SECRET });
  }

  static parseFQL<T = object>(fql: any, ref_keys: string[] = []) {
    const { data } = fql;
    data.id = fql.ref.id;
    data.ts = fql.ts;
    ref_keys.forEach((k) => (data[k] = data[k] ? { id: data[k].id } : undefined));
    return data as T;
  }

  static toRef(collection: string, id: string): faunadb.Expr {
    return q.Ref(q.Collection(collection), id);
  }

  static async one<T = object>(
    index: string,
    param: faunadb.ExprArg | undefined,
    parser: Function
  ): Promise<T | undefined> {
    try {
      return parser(
        await Fauna.client().query(q.Get(q.Match(q.Index(index), param || [])))
      );
    } catch (e) {
      // Sentry.captureException(e);
      return undefined;
    }
  }

  static async get<T = object>(
    ref: faunadb.ExprArg,
    parser: Function
  ): Promise<T | undefined> {
    try {
      return parser(await Fauna.client().query(q.Get(ref)));
    } catch (e) {
      // Sentry.captureException(e);
      return undefined;
    }
  }

  static async many<T = object>(
    index: string,
    param: faunadb.ExprArg,
    parser: Function
  ): Promise<T[]> {
    try {
      const result = await Fauna.client().query<{ data: object[] }>(
        q.Map(
          q.Paginate(q.Match(q.Index(index), param)),
          q.Lambda('x', q.Get(q.Var('x')))
        )
      );

      return result.data.map((r) => parser(r));
    } catch (e) {
      // Sentry.captureException(e);
      return [] as T[];
    }
  }

  static async create<T = object>(
    collection: string,
    data: Partial<T>,
    parser: Function
  ): Promise<T | undefined> {
    try {
      return parser(
        await Fauna.client().query(q.Create(q.Collection(collection), { data }))
      );
    } catch (e) {
      // Sentry.captureException(e);
      return undefined;
    }
  }

  static async update<T = object>(
    ref: faunadb.ExprArg,
    data: Partial<T>,
    parser: Function
  ): Promise<T | undefined> {
    try {
      return parser(await Fauna.client().query(q.Update(ref, { data })));
    } catch (e) {
      // Sentry.captureException(e);
      return undefined;
    }
  }

  static async delete(ref: faunadb.ExprArg): Promise<boolean> {
    try {
      await Fauna.client().query(q.Delete(ref));
      return true;
    } catch (e) {
      // Sentry.captureException(e);
      return false;
    }
  }
}
