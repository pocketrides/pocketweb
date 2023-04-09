import { z } from 'zod';
import type { ClientRef } from './Fauna';
import type { ClientNametag } from './Nametag';

export const draft_pocket_member_status_validator = z.enum([
  'joined',
  'pending',
  'banned',
  'admin'
]);

export type PocketMemberStatus = z.infer<
  typeof draft_pocket_member_status_validator
>;

export const draft_pocket_member_validator = z.object({
  status: draft_pocket_member_status_validator,
  settings: z.object({
    enable_notifications: z.boolean()
  })
});

export type ClientPocketMember = {
  pocket_ref: ClientRef;
  nametag_ref: ClientRef;
  nametag: ClientNametag;
  status: PocketMemberStatus;
  settings: {
    enable_notifications: boolean;
  };
};
