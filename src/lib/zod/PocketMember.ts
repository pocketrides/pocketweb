import { z } from 'zod';
import { client_ref_validator, type ClientRef } from './Fauna';
import { client_nametag_validator, type ClientNametag } from './Nametag';

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

export const client_pocket_member_validator = draft_pocket_member_validator.extend({
  id: z.string(),
  ts: z.number(),
  pocket_ref: client_ref_validator,
  nametag_ref: client_ref_validator,
  nametag: client_nametag_validator
});

export type ClientPocketMember = {
  id: string;
  ts: number;
  pocket_ref: ClientRef;
  nametag_ref: ClientRef;
  nametag: ClientNametag;
  status: PocketMemberStatus;
  settings: {
    enable_notifications: boolean;
  };
};
