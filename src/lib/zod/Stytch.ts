import { getCountryCodeForRegionCode } from 'awesome-phonenumber';
import { z } from 'zod';
import type { ServerNametag } from './Nametag';
import type { ServerAccount } from './Account';

const regions = ['US']; //, 'GB', 'SG'];
const flags = ['🇺🇸']; //, '🇬🇧', '🇸🇬'];

export const AVAILABLE_COUNTRIES = regions.map((r, i) => ({
  value: r,
  display: `${flags[i]} +${getCountryCodeForRegionCode(r)}`
}));

export const secret_code_validator = z.string().regex(/(^\d{6}$)/g);

export type DateString = string;

export type StytchAuthenticatedResponse = {
  stytch_user_id?: string;
  fauna_account_id?: string | null;
  fauna_account?: ServerAccount;

  nametag?: ServerNametag;
  nametag_id?: string | null;

  session_token: string;
  session_expires: DateString;
  room_key?: string; // session_jwt, only present if nametag_id exists
};

export type StytchCustomClaims = {
  // fauna account id
  faid?: string | null;
  // ServerAccount as json string
  fa?: string | null;
  // nametag id
  nid?: string | null;
  // ServerNametag as json strong
  n?: string | null;
};
