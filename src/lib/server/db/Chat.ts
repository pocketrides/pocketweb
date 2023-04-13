import type { ClientChat, DraftChat } from '$lib/zod/Chat';
import { Fauna, q } from './Fauna';
import { Nametag } from './Nametag';
import { Pocket } from './Pocket';

export class Chat {
  static collection = 'chats';

  static fql_for = {
    delete_all: (pocket_id: string) => {
      return q.Map(
        q.Paginate(
          q.Match(q.Index('chats_by_pocket_ref'), [Pocket.toRef(pocket_id)]),
          { size: 2500 }
        ),
        q.Lambda('chat_ref', q.Delete(q.Var('chat_ref')))
      );
    }
  };

  static async list(pocket_id: string): Promise<ClientChat[]> {
    try {
      const query = await Fauna.client().query<{
        data: { chat: any; nametag: any }[];
      }>(
        q.Map(
          q.Paginate(
            q.Match(q.Index('chats_by_pocket_ref'), [Pocket.toRef(pocket_id)]),
            { before: null, size: 120 }
          ),
          q.Lambda(
            'chat_ref',
            q.Let(
              {
                chat: q.Get(q.Var('chat_ref'))
              },
              {
                chat: q.Var('chat'),
                nametag: q.Get(q.Select(['data', 'nametag_ref'], q.Var('chat')))
              }
            )
          )
        )
      );

      return query.data.map((c) => this.parseFQL(c.chat, c.nametag));
    } catch (e) {
      console.error('db/Chat.list()', e);
      return [];
    }
  }

  static async create(
    nametag_id: string,
    draft: DraftChat
  ): Promise<ClientChat | undefined> {
    try {
      const data = {
        nametag_ref: Nametag.toRef(nametag_id),
        pocket_ref: Pocket.toRef(draft.pocket_id),
        messages: draft.messages
      };

      const query = await Fauna.client().query<{ chat: any; nametag: any } | null>(
        q.Let(
          {
            pocket_ref: Pocket.toRef(draft.pocket_id),
            pocket_exists: q.Exists(q.Var('pocket_ref')),
            pocket: q.If(q.Var('pocket_exists'), q.Get(q.Var('pocket_ref')), null),
            is_member_match: q.Match(
              q.Index('pocket_members_by_pocket_ref_and_nametag_ref'),
              [Pocket.toRef(draft.pocket_id), Nametag.toRef(nametag_id)]
            ),
            is_member: q.Exists(q.Var('is_member_match')),
            is_cohost_match: q.Match(
              q.Index('pocket_cohosts_by_pocket_ref_and_nametag_ref'),
              [Pocket.toRef(draft.pocket_id), Nametag.toRef(nametag_id)]
            ),
            is_cohost: q.Exists(q.Var('is_cohost_match')),
            is_owner: q.If(
              q.Var('pocket_exists'),
              q.Equals(
                Nametag.toRef(nametag_id),
                q.Select(['data', 'nametag_ref'], q.Var('pocket'))
              ),
              false
            )
          },
          q.If(
            q.Or(q.Var('is_member'), q.Var('is_cohost'), q.Var('is_owner')),
            q.Let(
              {
                chat: q.Create(q.Collection(this.collection), { data })
              },
              {
                chat: q.Var('chat'),
                nametag: q.Get(q.Select(['data', 'nametag_ref'], q.Var('chat')))
              }
            ),
            null
          )
        )
      );

      if (query) {
        return this.parseFQL(query.chat, query.nametag);
      } else {
        return undefined;
      }
    } catch (e) {
      console.error('db/Chat.create()', e);
      return undefined;
    }
  }

  static toRef(id: string) {
    return Fauna.toRef(this.collection, id);
  }

  static parseFQL(fql: any, nametag: any) {
    return {
      ...Fauna.parseFQL<ClientChat>(fql, ['pocket_ref', 'nametag_ref']),
      nametag: Nametag.parseClientFQL(nametag)
    } as ClientChat;
  }
}
