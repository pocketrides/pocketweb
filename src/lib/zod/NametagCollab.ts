import type { Expr } from 'faunadb';
import { client_nametag_validator, type ClientNametag } from './Nametag';
import { z } from 'zod';

export const client_nametag_collab_validator = z.object({
  authorized_nametag: client_nametag_validator,
  nametag: client_nametag_validator
});

export type DraftNametagCollab = {
  // the account authorized_nametag_ref belongs to
  authorized_account_ref: Expr;
  // the nametag authorized to use this nametag
  authorized_nametag_ref: Expr;
  // the nametag that is to be used
  nametag_ref: Expr;
};

export type ClientNametagCollab = {
  authorized_nametag: ClientNametag;
  nametag: ClientNametag;
};
