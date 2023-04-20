import { WorldfeedLoadRequest } from '$lib/api/worldfeed/load.js';

export const load = async (event) => {
  const worldfeed = await WorldfeedLoadRequest.get(
    event.url.searchParams,
    event.fetch
  );

  return {
    worldfeed
  };
};
