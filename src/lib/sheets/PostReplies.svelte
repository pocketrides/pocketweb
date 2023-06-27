<script lang="ts">
  import Replies from '$lib/components/replies/Replies.svelte';
  import Sheet from '$lib/components/Sheet.svelte';
  import { RepliesManagerStore } from '$lib/stores/replies';
  import MessageComposer from '$lib/components/messaging/MessageComposer.svelte';
  import type { MessageComposerEvent } from '$lib/zod/Message';
  import { ReplyToPostRequest } from '$lib/api/reply/reply_to_post';
  import { page } from '$app/stores';
  import { Room, type RoomConnection } from '$lib/api/room';
  import type { ClientReply } from '$lib/zod/Reply';

  let replies_are_scrolled_up = false;
  let shadow: HTMLElement;

  let room: RoomConnection | undefined;
  let last_connection: Date;
  let retry_count = 0;
  let scrollToBottomIfAtBottom: () => void;

  const connect = async () => {
    if ($RepliesManagerStore.post_id) {
      room = await Room.connect(
        'post',
        $RepliesManagerStore.post_id,
        $page.data.room_key
      );

      if (room) {
        last_connection = new Date();
        retry_count = 0;

        room.handleMessage((msg) => {
          RepliesManagerStore.update((prev) => {
            if (prev.replies) prev.replies.push(msg as ClientReply);
            else prev.replies = [msg as ClientReply];
            return prev;
          });

          scrollToBottomIfAtBottom();
        });

        room.handleNewCount((new_count: number) => {
          $RepliesManagerStore.latest_count = new_count;
        });

        room.handleEarlyDisconnect(async () => {
          if (retry_count > 5) return;

          retry_count += 1;

          disconnect();
          await connect();
        });
      }
    }
  };

  const disconnect = () => {
    if (room) {
      room.disconnect();
      room = undefined;
    }
  };

  const sheetClosed = () => {
    disconnect();
    $RepliesManagerStore.replies = [];
  };

  const handleReply = async (
    e: CustomEvent<MessageComposerEvent>,
    scrollToBottom: Function
  ) => {
    if (!$RepliesManagerStore.post_id) return;

    let res = await ReplyToPostRequest.post({
      post_id: $RepliesManagerStore.post_id,
      messages: e.detail.messages
    });

    if (res.success) {
      e.detail.completeCallback(true);

      RepliesManagerStore.update((prev) => {
        if (prev.replies && res.success) {
          res.reply.pending = true;
          prev.replies.push(res.reply);
          prev.latest_count = res.new_count;
        } else if (!prev.replies && res.success) {
          res.reply.pending = true;
          prev.replies = [res.reply];
          prev.latest_count = res.new_count;
        }

        return prev;
      });

      room?.updateCount(res.new_count);
      room?.sendMessage(res.reply, $page.data.room_key);

      scrollToBottom();
    } else {
      e.detail.completeCallback(false);
    }
  };

  const handleScroll = (e: any) => {
    if (!shadow) return;
    const target = e.target as HTMLElement;
    replies_are_scrolled_up =
      Math.ceil(target.scrollTop) <
      Math.floor(target.scrollHeight - target.clientHeight);
  };
</script>

<Sheet
  id="post_replies"
  header="Replies"
  icon="reply"
  padded={false}
  nav_height={115}
  bind:scrollToBottomIfAtBottom
  on:activate={connect}
  on:dismiss={sheetClosed}
  on:scroll={handleScroll}
  let:scrollContentToBottom
>
  <div class="body">
    <Replies />
  </div>
  <nav
    slot="nav"
    class="shadow"
    let:scrollContentToBottom
    bind:this={shadow}
    class:active={replies_are_scrolled_up}
    data-fill="system-light"
  >
    <MessageComposer
      on:message={(e) => {
        handleReply(e, scrollContentToBottom);
      }}
      always_active={true}
      placeholder="Write a reply…"
    />
  </nav>
</Sheet>

<style lang="scss">
  .shadow {
    transition: box-shadow 0.15s ease-in-out;
    box-shadow: 0 0 0 0 rgba(var(--dark), 0);
    border-top: 1px solid rgba(var(--dark), 0.15);
  }

  .shadow.active {
    box-shadow: 0 -8px 8px -8px rgba(var(--dark), 0.5);
  }
</style>
