import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET = (async (event) => {
  const theme = event.url.searchParams.get('theme');

  return json(
    {
      display: 'standalone',
      icons: [
        {
          src: `/pocketrides-${theme}.png`,
          sizes: 'any',
          type: 'image/png'
        }
      ],
      name: 'pocketrides!',
      short_name: 'pocketrides!',
      start_url: '/',
      background_color: 'rgb(255, 241, 216)'
    },
    {
      headers: {
        'Content-Type': 'application/manifest+json'
      }
    }
  );
}) satisfies RequestHandler;
