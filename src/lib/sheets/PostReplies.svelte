<script lang="ts">
  import Replies from '$lib/components/replies/Replies.svelte';
  import Sheet from '$lib/components/Sheet.svelte';
  import { RepliesManagerStore } from '$lib/stores/RepliesManager';
  import MessageComposer from '$lib/components/messaging/MessageComposer.svelte';
  import type { MessageComposerEvent } from '$lib/zod/Message';
  import { ReplyToPostRequest } from '$lib/api/reply/reply_to_post';
  import { page } from '$app/stores';
  import { Room, type RoomConnection } from '$lib/api/room';

  let replies_are_scrolled_up = false;
  let shadow: HTMLElement;

  let room: RoomConnection | undefined;

  const connect = async () => {
    if ($RepliesManagerStore.post_id) {
      room = await Room.connect(
        'post',
        $RepliesManagerStore.post_id,
        $page.data.room_key
      );

      if (room) {
        room.handleMessage(() => {
          console.log('> handling a message');
        });
      }
    } else {
      console.log('not connecting');
    }
  };

  const disconnect = () => {
    if (room) {
      room.disconnect();
      room = undefined;
    }
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
        } else if (res.success && !prev.replies) {
          res.reply.pending = true;
          prev.replies = [res.reply];
        }

        return prev;
      });

      scrollToBottom();
    } else {
      e.detail.completeCallback(false);
    }
  };

  const handleScroll = (e: any) => {
    if (!shadow) return;
    const target = e.target as HTMLElement;
    replies_are_scrolled_up =
      target.scrollTop < target.scrollHeight - target.clientHeight;
  };
</script>

<Sheet
  id="post_replies"
  header="Replies"
  icon="reply"
  on:activate={connect}
  on:dismiss={disconnect}
  on:scroll={handleScroll}
  let:scrollContentToBottom
>
  <div>
    <Replies />
  </div>
  <nav
    slot="nav"
    class="shadow"
    bind:this={shadow}
    class:active={replies_are_scrolled_up}
    data-fill="system-superlight"
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
