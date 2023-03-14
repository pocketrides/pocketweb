<script lang="ts">
  import { ReplyToPostRequest } from '$lib/api/reply/reply_to_post';
  import type {
    MessageComposerActiveEvent,
    MessageComposerEvent
  } from '$lib/zod/Message';
  import type { ClientReply } from '$lib/zod/Reply';

  import { writable } from 'svelte/store';
  import Button from '../Button.svelte';
  import ButtonRow from '../ButtonRow.svelte';
  import Container from '../Container.svelte';
  import MessageComposer from '../messaging/MessageComposer.svelte';
  import Row from '../Row.svelte';
  import Select from '../Select.svelte';
  import Reply from './Reply.svelte';

  export let post_id: string;
  export let replies: ClientReply[] | undefined;

  const controller = writable<ClientReply[]>(replies || []);
  const is_active = writable(false);
  const has_util_nav = writable(false);

  let shadow: HTMLDivElement;
  let message_list: HTMLUListElement;
  let sort_value: 'top' | 'new' = 'top';
  let replies_are_scrolled_up = false;

  const checkNav = () => {
    $has_util_nav =
      typeof document !== 'undefined'
        ? document.querySelectorAll('[data-util-nav]').length !== 0
        : false;
  };

  const repliesScroll = () => {
    if (!message_list || !$is_active || !shadow) {
      replies_are_scrolled_up = false;
      return;
    }
    const rect = message_list.getBoundingClientRect();
    replies_are_scrolled_up = rect.bottom > window.innerHeight - shadow.offsetHeight;
    checkNav();
  };

  const handleReply = async (e: CustomEvent<MessageComposerEvent>) => {
    const res = await ReplyToPostRequest.post({
      post_id,
      messages: e.detail.messages
    });

    if (res.success) {
      e.detail.completeCallback(true);

      controller.update((prev) => {
        res.reply.pending = true;
        prev.push(res.reply);

        return prev;
      });
    } else {
      e.detail.completeCallback(false);
    }
  };

  const handleActiveStatus = (e: CustomEvent<MessageComposerActiveEvent>) => {
    console.log('> handleActiveStatus', e.detail.is_active);
    $is_active = e.detail.is_active;
    checkNav();

    // if ($is_active && message_list) {
    // sort_value = 'new';
    // message_list.scrollTo(0, message_list.scrollHeight);
    // }
  };
</script>

<svelte:window on:scroll={repliesScroll} />

<Container fill="light" padded={false}>
  {#if $controller.length}
    {#if $is_active}
      <header data-fill="superlight">
        <Row padded>
          <h2 slot="left" class="h3">All Replies</h2>
          <div slot="right">
            <ButtonRow let:controller initial="sort">
              <Button
                id="close"
                icon="close"
                label="Close replies"
                {controller}
                on:click={() => {
                  $is_active = false;
                  repliesScroll();
                }}
              />
              <Select id="sort" bind:value={sort_value} small collapse {controller}>
                <option disabled>Sort by…</option>
                <option value="top">Top</option>
                <option value="new">New</option>
              </Select>
            </ButtonRow>
          </div>
        </Row>
      </header>
      <ul
        bind:this={message_list}
        data-flex="v"
        data-unstyle
        data-fill="system-light"
      >
        {#each $controller as reply (reply.id)}
          <Reply {reply} />
        {/each}
      </ul>
    {:else}
      <div
        data-padded
        data-top-reply
        on:keyup={() => {
          $is_active = true;
        }}
        on:mouseup={() => {
          $is_active = true;
        }}
      >
        <!-- <Container padded rounded fill="system-superlight"> -->
        <h2 class="h3 half">Top reply:</h2>
        <Reply reply={$controller[0]} />
        <!-- </Container> -->
      </div>
    {/if}
  {/if}
  <div
    class="shadow"
    bind:this={shadow}
    class:active={replies_are_scrolled_up}
    class:sticky={$is_active}
    class:has_util_nav={$has_util_nav}
    data-fill={$is_active ? 'system-light' : 'light'}
  >
    <MessageComposer
      on:message={handleReply}
      on:active={handleActiveStatus}
      always_active={$is_active}
      placeholder="Write a reply…"
    />
  </div>
</Container>

<style lang="scss">
  header {
    border-bottom: 1px solid rgba(var(--dark), 0.25);
    z-index: 14;
    position: sticky;
    top: 49px;
  }

  [data-top-reply] {
    padding-bottom: 0;

    :global([data-padded]) {
      padding: 0;
    }

    :global(> *) {
      pointer-events: none;
    }
  }

  .shadow {
    transition: box-shadow 0.15s ease-in-out;
    box-shadow: 0 -16px 16px -18px rgba(var(--dark), 0);
  }

  .shadow.active {
    box-shadow: 0 -16px 16px -18px rgba(var(--dark), 0.75);
  }

  .shadow.sticky,
  .shadow:focus-within {
    position: sticky;
    bottom: 0;
    z-index: 13;
  }

  .shadow.sticky.has_util_nav,
  .shadow:focus-within.has_util_nav {
    bottom: 72px;

    @media (max-width: 640px) {
      bottom: 0;
      z-index: 16;
    }
  }
</style>
