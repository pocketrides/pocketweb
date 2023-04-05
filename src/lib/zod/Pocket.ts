import { z } from 'zod';
import { THEME_VALUES, type ThemeValue } from './Theme';
import { cloudinary_photo_validator } from './CloudinaryPhoto';
import { google_place_validator } from './GooglePlace';
import { link_validator } from './Link';
import { client_nametag_validator, type ClientNametag } from './Nametag';

export const POCKET_MAX_COHOSTS = 5;
export const pocket_name_html_validator = z.string().min(1).max(60);
export const pocket_name_raw_validator = z.string();

export const pocket_all_details = ['time', 'place', 'links', 'desc'] as const;

export const pocket_available_details = z.array(z.enum(pocket_all_details));

export type PocketEnabledDetails = z.infer<typeof pocket_available_details>;

const draft_pocket_time_validator = z.object({
  start_date: z.string().min(1).optional().nullable(),
  start_datetime: z.string().min(1).optional().nullable(),
  end_date: z.string().min(1).optional().nullable(),
  end_datetime: z.string().min(1).optional().nullable(),
  all_day: z.boolean().optional().nullable(),
  whenever: z.boolean().optional().nullable(),
  whenever_reason: z.string().max(44).optional().nullable()
});

export const draft_pocket_details_validator = draft_pocket_time_validator.extend({
  place: google_place_validator.optional().nullable(),

  links: z.array(link_validator).min(1).max(10).optional().nullable(),

  desc_html: z.string().min(1).max(720).optional().nullable(),
  desc_raw: z.string().optional().nullable()
});

export const draft_pocket_validator = z.object({
  hosts: z.array(client_nametag_validator).max(POCKET_MAX_COHOSTS),
  name_html: pocket_name_html_validator,
  name_raw: pocket_name_raw_validator,
  theme: z.enum(THEME_VALUES),
  cover_art: z.array(cloudinary_photo_validator),
  details_enabled: pocket_available_details,
  details: draft_pocket_details_validator,
  settings: z.object({
    joinability: z.enum(['anyone', 'moderated', 'broadcast']),
    visibility: z.enum(['listed', 'unlisted'])
  })
});

export const server_pocket_validator = draft_pocket_validator.extend({
  nametag_ref: client_nametag_validator,
  hosts: z.array(client_nametag_validator)
});

export type DraftPocket = z.infer<typeof draft_pocket_validator>;
export type DraftPocketDetails = z.infer<typeof draft_pocket_details_validator>;
export type ServerPocket = z.infer<typeof server_pocket_validator>;

export const blankPocket = (theme: ThemeValue): DraftPocket => {
  return {
    hosts: [],
    name_html: '',
    name_raw: '',
    theme,
    cover_art: [],
    details_enabled: [],
    details: {},
    settings: {
      joinability: 'anyone',
      visibility: 'listed'
    }
  };
};
