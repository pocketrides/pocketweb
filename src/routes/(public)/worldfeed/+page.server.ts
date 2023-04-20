import { WorldfeedLoadRequest } from '$lib/api/worldfeed/load.js';
import { redirect } from '@sveltejs/kit';

export const load = async (event) => {
  if (event.url.searchParams.has('i') === false) {
    // @ts-ignore
    if (typeof event.request.cf !== 'undefined') {
      const {
        city,
        regionCode,
        country
      }: // @ts-ignore
      { city: string; country: string; regionCode: string } = event.request.cf;
      const sp = new URLSearchParams();

      sp.append('c', city);
      sp.append('s', regionCode);
      sp.append('i', country);

      throw redirect(302, `/worldfeed?${sp.toString()}`);
    }
  }

  const worldfeed = await WorldfeedLoadRequest.get(
    event.url.searchParams,
    event.fetch
  );

  return {
    worldfeed
  };
};
