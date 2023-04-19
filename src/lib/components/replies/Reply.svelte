<script lang="ts">
  import type { ClientReply } from '$lib/zod/Reply';
  import { fly } from 'svelte/transition';
  import ReplyActions from './ReplyActions.svelte';
  import ReplyLink from './ReplyLink.svelte';
  import ReplyPhotos from './ReplyPhotos.svelte';
  import ReplyText from './ReplyText.svelte';

  export let reply: ClientReply;
</script>

<li data-flex="v" data-gap="sm" data-theme={reply.nametag.theme}>
  {#each reply.messages as message, index (message)}
    {#if message.type === 'text'}
      {#if reply.pending}
        <div in:fly={{ y: 100, delay: index * 50, duration: 150 }}>
          <ReplyText {message} />
        </div>
      {:else}
        <ReplyText {message} />
      {/if}
    {/if}
    {#if message.type === 'photos' && message.photos.length}
      {#if reply.pending}
        <div in:fly={{ y: 100, delay: index * 50, duration: 150 }}>
          <ReplyPhotos {message} />
        </div>
      {:else}
        <ReplyPhotos {message} />
      {/if}
    {/if}
    {#if message.type === 'link'}
      {#if reply.pending}
        <div in:fly={{ y: 100, delay: index * 50, duration: 150 }}>
          <ReplyLink {message} />
        </div>
      {:else}
        <ReplyLink {message} />
      {/if}
    {/if}
  {/each}
  {#if reply.pending}
    <div
      data-padded
      in:fly={{ y: 100, delay: reply.messages.length * 50, duration: 150 }}
    >
      <ReplyActions {reply} />
    </div>
  {:else}
    <div data-padded>
      <ReplyActions {reply} />
    </div>
  {/if}
</li>

<style lang="scss">
  li {
    padding: 0.5rem 0;
    align-items: flex-start;
  }

  li :global([data-padded]) {
    padding: 0 1rem 0;
  }
</style>
