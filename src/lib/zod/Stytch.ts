import { getCountryCodeForRegionCode } from 'awesome-phonenumber';

const regions = ['US', 'GB', 'SG'];
const flags = ['🇺🇸', '🇬🇧', '🇸🇬'];

export const AVAILABLE_COUNTRIES = regions.map((r, i) => ({
  value: r,
  display: `${flags[i]} +${getCountryCodeForRegionCode(r)}`
}));
