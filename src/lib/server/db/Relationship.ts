import type {
  ServerCloseFriend,
  ServerFollower,
  ServerFriend,
  ServerBlocked
} from '$lib/zod/Relationships';
import { Fauna } from './Fauna';
import { Nametag } from './Nametag';
import { NametagStats } from './NametagStats';

export class Relationship {
  static collection_friends = 'friends';
  static collection_close_friends = 'close_friends';
  static collection_followers = 'followers';
  static collection_blocks = 'blocks';

  static async follow(my_nametag_id: string, target_nametag_id: string) {
    const is_private = await NametagStats.isPrivate(my_nametag_id);
    const exists = await Relationship.isFollowing(my_nametag_id, target_nametag_id);

    if (exists) return;

    await Fauna.create<ServerFriend>(
      Relationship.collection_friends,
      {
        nametag_ref: Nametag.toRef(my_nametag_id),
        friend_ref: Nametag.toRef(target_nametag_id),
        pending: is_private
      },
      Relationship.parseFQL
    );

    await NametagStats.addFriend(my_nametag_id);

    await Fauna.create<ServerFollower>(
      Relationship.collection_followers,
      {
        nametag_ref: Nametag.toRef(target_nametag_id),
        follower_ref: Nametag.toRef(my_nametag_id),
        pending: is_private
      },
      Relationship.parseFQL
    );

    await NametagStats.addFollower(target_nametag_id);
  }

  static async isFollowing(
    my_nametag_id: string,
    target_nametag_id: string
  ): Promise<boolean> {
    const exists = await Fauna.one<ServerFriend>(
      'is_friend',
      [Nametag.toRef(my_nametag_id), Nametag.toRef(target_nametag_id)],
      Relationship.parseFQL
    );

    return exists === undefined ? false : true;
  }

  static async unfollow(my_nametag_id: string, target_nametag_id: string) {
    const friend = await Fauna.one<ServerFriend>(
      'is_friend',
      [Nametag.toRef(my_nametag_id), Nametag.toRef(target_nametag_id)],
      Relationship.parseFQL
    );

    const follower = await Fauna.one<ServerFollower>(
      'is_follower',
      [Nametag.toRef(target_nametag_id), Nametag.toRef(my_nametag_id)],
      Relationship.parseFQL
    );

    if (friend) {
      await Fauna.delete(Fauna.toRef(Relationship.collection_friends, friend.id));
      await NametagStats.subtractFriend(my_nametag_id);
    }

    if (follower) {
      await Fauna.delete(
        Fauna.toRef(Relationship.collection_followers, follower.id)
      );

      await NametagStats.substractFollower(target_nametag_id);
    }

    await Relationship.removeFromCloseFriends(my_nametag_id, target_nametag_id);
  }

  static async addToCloseFriends(my_nametag_id: string, target_nametag_id: string) {
    const exists = await Relationship.isCloseFriend(
      my_nametag_id,
      target_nametag_id
    );

    if (exists) return;

    await Fauna.create<ServerCloseFriend>(
      Relationship.collection_close_friends,
      {
        nametag_ref: Nametag.toRef(my_nametag_id),
        close_friend_ref: Nametag.toRef(target_nametag_id)
      },
      Relationship.parseFQL
    );
  }

  static async isCloseFriend(
    my_nametag_id: string,
    target_nametag_id: string
  ): Promise<boolean> {
    const exists = await Fauna.one<ServerCloseFriend>(
      'is_close_friend',
      [Nametag.toRef(my_nametag_id), Nametag.toRef(target_nametag_id)],
      Relationship.parseFQL
    );

    return exists === undefined ? false : true;
  }

  static async removeFromCloseFriends(
    my_nametag_id: string,
    target_nametag_id: string
  ) {
    const close_friend = await Fauna.one<ServerCloseFriend>(
      'is_close_friend',
      [Nametag.toRef(my_nametag_id), Nametag.toRef(target_nametag_id)],
      Relationship.parseFQL
    );

    if (close_friend)
      await Fauna.delete(
        Fauna.toRef(Relationship.collection_close_friends, close_friend.id)
      );
  }

  static async block(my_nametag_id: string, target_nametag_id: string) {
    const exists = await Relationship.isBlocking(my_nametag_id, target_nametag_id);

    if (exists) return;

    await Relationship.removeFromCloseFriends(my_nametag_id, target_nametag_id);
    await Relationship.removeFromCloseFriends(target_nametag_id, my_nametag_id);

    await Relationship.unfollow(my_nametag_id, target_nametag_id);
    await Relationship.unfollow(target_nametag_id, my_nametag_id);

    await Fauna.create(
      Relationship.collection_blocks,
      {
        nametag_ref: Nametag.toRef(my_nametag_id),
        blocked_ref: Nametag.toRef(target_nametag_id)
      },
      Relationship.parseFQL
    );
  }

  static async isBlocking(
    my_nametag_id: string,
    target_nametag_id: string
  ): Promise<boolean> {
    const exists = await Fauna.one(
      'is_blocked',
      [Nametag.toRef(my_nametag_id), Nametag.toRef(target_nametag_id)],
      Relationship.parseFQL
    );

    return exists === undefined ? false : true;
  }

  static async unblock(my_nametag_id: string, target_nametag_id: string) {
    const blocked_friend = await Fauna.one<ServerBlocked>(
      'is_blocked',
      [Nametag.toRef(my_nametag_id), Nametag.toRef(target_nametag_id)],
      Relationship.parseFQL
    );

    if (blocked_friend)
      await Fauna.delete(
        Fauna.toRef(Relationship.collection_blocks, blocked_friend.id)
      );
  }

  static parseFQL(fql: any) {
    return Fauna.parseFQL(fql, [
      'nametag_ref',
      'friend_ref',
      'close_friend_ref',
      'follower_ref',
      'blocked_ref'
    ]);
  }
}
