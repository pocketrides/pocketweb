import type { WorldfeedLocation } from '$lib/zod/Worldfeed';

export const formatWorldfeedLocation = (loc: WorldfeedLocation): string => {
  if (loc.city && loc.state && loc.country) {
    return `${loc.city}, ${loc.state}, ${loc.country}`;
  }

  return `Unknown`;
};

export const getWorldfeedLink = (loc: WorldfeedLocation): string => {
  const qs = new URLSearchParams();

  if (loc.city) qs.append('c', loc.city);
  if (loc.state) qs.append('s', loc.state);
  if (loc.country) qs.append('i', loc.country);

  return `/worldfeed?${qs.toString()}`;
};
