import type { Expr } from 'faunadb';
import type { ClientRef } from './Fauna';
import type { ClientNametag } from './Nametag';

export type FaunaPocketCohost = {
  nametag_ref: Expr;
  pocket_ref: Expr;
  nametag: ClientNametag;
};

export type ClientPocketCohost = {
  nametag_ref: ClientRef;
  nametag: ClientNametag;
  pocket_ref: ClientRef;
};
