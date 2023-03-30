export type PocketqueuePayload =
  | {
      type: 'payout';
      data: {
        payout_id: string;
        nametag_id: string;
        first_like_id: string;
        last_like_id: string;
        after_id?: string;
      };
    }
  | {
      type: 'remove_friends';
      data: {
        my_nametag_id: string;
        friends_after_id?: string;
        followers_after_id?: string;
      };
    };
