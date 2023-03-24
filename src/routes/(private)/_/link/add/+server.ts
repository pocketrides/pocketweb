import { AddLinkRequest, type AddLinkRequestResponse } from '$lib/api/link/add';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { GOOGLEBOT_UA, parseOpenGraphTags } from '$lib/server/util/og-parser';

export const POST = (async (event) => {
  const payload = AddLinkRequest.payload_parser.safeParse(
    await event.request.json()
  );
  let response: AddLinkRequestResponse = { success: false };

  if (payload.success) {
    try {
      const og_tags = await parseOpenGraphTags(
        await fetch(payload.data.link, {
          headers: {
            'User-Agent': GOOGLEBOT_UA
          },
          redirect: 'follow'
        })
      );

      if (og_tags) {
        response = {
          success: true,
          link: {
            url: payload.data.link,
            og_title: og_tags.og_title,
            og_desc: og_tags.og_desc,
            og_image: og_tags.og_image
          }
        };
      }
    } catch (e) {}
  }

  return json(response);
}) satisfies RequestHandler;
