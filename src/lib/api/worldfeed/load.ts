import type { WorldfeedListResult } from '$lib/server/db/Worldfeed';

export class WorldfeedLoadRequest {
  static async get(qs: URLSearchParams, _fetch = fetch) {
    const req = await _fetch(`/_/worldfeed?${qs.toString()}`);
    const json = await req.json<WorldfeedListResult>();
    return json;
  }
}
