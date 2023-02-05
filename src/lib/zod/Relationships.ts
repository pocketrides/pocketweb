import { z } from 'zod';
import { client_ref_validator } from './Fauna';

const shape = z.object({
  id: z.string(),
  nametag_ref: client_ref_validator,
  pending: z.boolean()
});

export const server_friend_validator = shape.extend({
  friend_ref: client_ref_validator
});

export const server_close_friend_validator = shape.extend({
  close_friend_ref: client_ref_validator
});

export const server_follower_validator = shape.extend({
  follower_ref: client_ref_validator
});

export const server_blocked_validator = shape.extend({
  blocked_ref: client_ref_validator
});

export type ServerFriend = z.infer<typeof server_friend_validator>;
export type ServerCloseFriend = z.infer<typeof server_close_friend_validator>;
export type ServerFollower = z.infer<typeof server_follower_validator>;
export type ServerBlocked = z.infer<typeof server_blocked_validator>;
