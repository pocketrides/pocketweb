import type { GooglePlace } from '$lib/zod/GooglePlace';

export const getPlaceLink = (place: GooglePlace): string => {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    place.formatted_address || place.name || ''
  )}&query_place_id=${encodeURIComponent(place.place_id || '')}`;
};
