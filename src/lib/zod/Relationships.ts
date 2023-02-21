import type { Expr } from 'faunadb';
import type { ClientRef } from './Fauna';

type ServerShape = {
  id: string;
  nametag_ref: Expr | ClientRef;
  pending: boolean;
};

export type ServerFriend = ServerShape & {
  friend_ref: Expr | ClientRef;
};

export type ServerCloseFriend = ServerShape & {
  close_friend_ref: Expr | ClientRef;
};

export type ServerFollower = ServerShape & {
  follower_ref: Expr | ClientRef;
};

export type ServerBlocked = ServerShape & {
  blocked_ref: Expr | ClientRef;
};
