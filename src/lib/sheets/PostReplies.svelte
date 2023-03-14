<script lang="ts">
  import Replies from '$lib/components/replies/Replies.svelte';
  import Sheet from '$lib/components/Sheet.svelte';
  import { RepliesManagerStore } from '$lib/stores/RepliesManager';
  import MessageComposer from '$lib/components/messaging/MessageComposer.svelte';
  import type { MessageComposerEvent } from '$lib/zod/Message';
  import { ReplyToPostRequest } from '$lib/api/reply/reply_to_post';

  let replies_are_scrolled_up = false;
  let shadow: HTMLElement;

  const handleReply = async (
    e: CustomEvent<MessageComposerEvent>,
    div: HTMLDivElement
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

      scrollToBottom(div);
    } else {
      e.detail.completeCallback(false);
    }
  };

  const scrollToBottom = (el: HTMLElement) => {
    let count = 0;
    let id = setInterval(() => {
      el.scrollTop = el.scrollHeight - el.clientHeight;
      count++;
      if (count > 10) {
        clearInterval(id);
      }
    }, 50);
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
  on:scroll={handleScroll}
  let:el
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
      on:active={() => {
        scrollToBottom(el);
      }}
      on:message={(e) => {
        handleReply(e, el);
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

    position: sticky;
    bottom: 0;
  }

  .shadow.active {
    box-shadow: 0 -8px 8px -8px rgba(var(--dark), 0.5);
  }

  @media (max-width: 640px) {
    .shadow {
      position: fixed;
      width: 100%;
    }

    div {
      padding-bottom: 120px;
    }
  }
</style>
