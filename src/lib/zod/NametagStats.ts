import { z } from 'zod';
import { client_ref_validator, type ClientRef } from './Fauna';
import type { Expr } from 'faunadb';

export const draft_nametag_stats_validator = z.object({
  profile_pic: z.string().optional(),
  friends: z.number(),
  followers: z.number(),
  posts: z.number(),
  private: z.boolean().optional(),
  likes_received: z.number().optional()
});

export const server_nametag_stats_validator = draft_nametag_stats_validator.extend({
  ref: client_ref_validator,
  id: z.string(),
  nametag_ref: client_ref_validator
});

export type DraftNametagStats = z.infer<typeof draft_nametag_stats_validator>;

export type ServerNametagStats = DraftNametagStats & {
  id: string;
  ref: ClientRef | Expr;
  nametag_ref: ClientRef | Expr;
  last_seen?: { [k: string]: string };
};

export const blankNametagStats = (): DraftNametagStats => {
  return {
    friends: 0,
    followers: 0,
    posts: 0,
    likes_received: 0
  };
};
