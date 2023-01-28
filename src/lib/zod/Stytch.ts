import { getCountryCodeForRegionCode } from 'awesome-phonenumber';
import { z } from 'zod';

const regions = ['US', 'GB', 'SG'];
const flags = ['🇺🇸', '🇬🇧', '🇸🇬'];

export const AVAILABLE_COUNTRIES = regions.map((r, i) => ({
  value: r,
  display: `${flags[i]} +${getCountryCodeForRegionCode(r)}`
}));

export const secret_code_validator = z.string().regex(/(^\d{6}$)/g);
