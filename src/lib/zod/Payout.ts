import type { Expr } from 'faunadb';
import type { ClientRef } from './Fauna';

export type ServerPayout = {
  account_ref: ClientRef | Expr;
  total: number;
  posts: ClientRef[] | Expr[];
};
