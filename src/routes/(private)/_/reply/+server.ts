import {
  ReplyToPostRequest,
  type ReplyToPostResponse
} from '$lib/api/reply/reply_to_post';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { Reply } from '$lib/server/db/Reply';
import { Notify, TopicSubscribe } from '$lib/server/Notify';
import { plural } from '$lib/util/plural';
import { LoadPostRequest } from '$lib/api/post/load';

export const POST = (async (event) => {
  let res: ReplyToPostResponse = { success: false };
  const payload = ReplyToPostRequest.payload_validator.safeParse(
    await event.request.json()
  );

  if (event.locals.nametag_id && payload.success) {
    res = await Reply.replyToPost(event.locals.nametag_id, payload.data);

    if (res.success) {
      const post = await LoadPostRequest.load(payload.data.post_id, event.fetch);

      const content = res.reply.messages
        .map((m) => {
          if (m.type === 'text') {
            let content = m.content_raw;
            if (content.length > 40) content = content.substring(0, 40) + '…';
            return content;
          }
          if (m.type === 'photos')
            return `uploaded ${plural(m.photos.length, 'pic', 'pics', true)}`;
          if (m.type === 'link') return `sent a link: ${m.link.url}`;
        })
        .map(
          (msg) =>
            `<strong>${res.success && res.reply.nametag.nametag}:</strong> ${msg}`
        );

      if (post) {
        let notif_title = post.contents[0].content_raw;
        if (notif_title.length > 40)
          notif_title = notif_title.substring(0, 40) + `…`;

        await Notify({
          title: `<strong>New reply: ${notif_title}</strong>`,
          content: content.join('<br/>'),
          topic: payload.data.post_id,
          action_url: `/post/${payload.data.post_id}`,
          recipients: [
            {
              // @ts-ignore
              topic: {
                subscribers: true
              }
            }
          ]
        });

        await TopicSubscribe(event.locals.nametag_id, post.id);
      }
    }
  }

  return json(res);
}) satisfies RequestHandler;
