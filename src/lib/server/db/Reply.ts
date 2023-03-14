import { Post } from './Post';
import type {
  ReplyToPostPayload,
  ReplyToPostResponse
} from '$lib/api/reply/reply_to_post';
import { Fauna, q } from './Fauna';
import { Nametag } from './Nametag';
import { blankReplyStats, type ClientReply } from '$lib/zod/Reply';

export class Reply {
  static collection = 'replies';

  static fql_for = {
    client_reply: (var_name: string = 'reply') => {
      return {
        id: q.Select(['ref', 'id'], q.Var(var_name)),
        ts: q.Select(['ts'], q.Var(var_name)),
        messages: q.Select(['data', 'messages'], q.Var(var_name)),
        stats: q.Select(['data', 'stats'], q.Var(var_name)),
        nametag: Nametag.fql_for.client_nametag()
      };
    }
  };

  static async replyToPost(
    nametag_id: string,
    payload: ReplyToPostPayload
  ): Promise<ReplyToPostResponse> {
    return await Fauna.client().query<ReplyToPostResponse>(
      q.Let(
        {
          post_ref: Post.toRef(payload.post_id),
          post_exists: q.Exists(q.Var('post_ref')),
          post: q.If(q.Var('post_exists'), q.Get(q.Var('post_ref')), null),
          has_post: q.If(q.IsNull(q.Var('post')), false, true),
          enable_replies: q.If(
            q.Var('has_post'),
            q.Select(['data', 'settings', 'enable_replies'], q.Var('post')),
            false
          ),
          can_reply: q.Var('enable_replies')
        },
        q.If(
          q.Var('can_reply'),
          q.Let(
            {
              nametag_ref: Nametag.toRef(nametag_id),
              nametag: q.Get(q.Var('nametag_ref')),
              reply: q.Create(q.Collection(this.collection), {
                data: {
                  nametag_ref: q.Var('nametag_ref'),
                  post_ref: q.Var('post_ref'),
                  messages: payload.messages,
                  stats: blankReplyStats()
                }
              })
            },
            {
              success: true,
              reply: this.fql_for.client_reply()
            }
          ),
          { success: false }
        )
      )
    );
  }

  static toRef(reply_id: string) {
    return Fauna.toRef(this.collection, reply_id);
  }

  static parseFQL(fql: any) {
    let reply = Fauna.parseFQL<ClientReply>(fql, ['nametag_ref', 'post_ref']);
    if (fql.nametag) reply.nametag = Nametag.parseClientFQL(fql.nametag);
    return reply;
  }
}
