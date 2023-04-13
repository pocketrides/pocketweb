import { LoadPostRequest } from '$lib/api/post/load';
import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { Fauna, q } from '$lib/server/db/Fauna';
import { Pocket, type GetPocketQueryResponse } from '$lib/server/db/Pocket';
import { Nametag } from '$lib/server/db/Nametag';
import {
  PocketMember,
  type QueryClientPocketMemberReturnType
} from '$lib/server/db/PocketMember';

export const load = (async (event) => {
  const post = await LoadPostRequest.load(event.params.post_id, event.fetch, true);

  if (!post) throw error(404);

  const parent = await event.parent();

  if (post.audience === 'pocket' && post.pocket_ref?.id) {
    let member_exists: boolean = true;

    try {
      const member_query = await Fauna.client().query<{
        exists: boolean;
        get_pocket: GetPocketQueryResponse;
        client_member: QueryClientPocketMemberReturnType | null;
      }>(
        q.Let(
          {
            pocket_ref: Pocket.toRef(post.pocket_ref.id),
            nametag_ref: Nametag.toRef(parent.my_nametag?.id || '123'),
            get_pocket: Pocket.fql_for.get_pocket()
          },
          q.If(
            q.Equals(
              q.Select(
                ['pocket', 'data', 'settings', 'joinability'],
                q.Var('get_pocket')
              ),
              'moderated'
            ),
            q.Let(
              {
                match: q.Match(
                  q.Index('pocket_members_by_pocket_ref_and_nametag_ref'),
                  [q.Var('pocket_ref'), q.Var('nametag_ref')]
                ),
                exists: q.Exists(q.Var('match')),
                member: q.If(q.Var('exists'), q.Get(q.Var('match')), null)
              },
              {
                exists: q.Var('exists'),
                client_member: q.If(
                  q.Var('exists'),
                  PocketMember.fql_for.client_pocket_member(),
                  null
                ),
                get_pocket: q.Var('get_pocket')
              }
            ),
            {
              get_pocket: {
                success: false
              }
            }
          )
        )
      );

      if (member_query.get_pocket.success) {
        const client_member = member_query.client_member
          ? PocketMember.parseFQL(
              member_query.client_member.member,
              member_query.client_member.nametag
            )
          : { status: 'unknown' };

        const pocket = Pocket.parseFQL(
          member_query.get_pocket.pocket,
          member_query.get_pocket.nametag,
          member_query.get_pocket.hosts,
          member_query.get_pocket.members_count[0]
        );

        member_exists =
          (member_query.exists === true && client_member.status === 'joined') ||
          Pocket.isPocketAdmin(parent.my_nametag?.id || '123', pocket);
      }
    } catch (e) {
      console.error('post/page.ts.load()', e);
    }

    if (member_exists === false) {
      throw error(404);
    }
  }

  if (
    post.settings.is_nsfw &&
    parent.my_nametag?.content_prefs?.allow_nsfw_posts !== true &&
    event.url.searchParams.has('ok') !== true
  )
    throw redirect(302, `/post/${post.id}/nsfw-warning`);

  return {
    post,
    my_nametag: parent.my_nametag,
    page_theme: post?.nametag.theme,
    room_key: parent.room_key
  };
}) satisfies PageServerLoad;
