import { z } from 'zod';
import { THEME_VALUES } from './Theme';
import { client_ref_validator, type ClientRef } from './Fauna';

export const draft_nametag_validator = z.object({
  nametag: z.string().min(1).max(32),
  theme: z.enum(THEME_VALUES)
});

export const server_nametag_validator = draft_nametag_validator.extend({
  id: z.string(),
  account_ref: client_ref_validator
});

export type DraftNametag = z.infer<typeof draft_nametag_validator>;

export type ServerNametag = DraftNametag & {
  id: string;
  account_ref: ClientRef;
};
