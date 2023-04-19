<script lang="ts">
  import { fly } from 'svelte/transition';
  import ChatActions from './ChatActions.svelte';
  import ChatLink from './ChatLink.svelte';
  import ChatPhotos from './ChatPhotos.svelte';
  import ChatText from './ChatText.svelte';
  import type { ClientChat } from '$lib/zod/Chat';

  export let chat: ClientChat;
</script>

<li data-flex="v" data-gap="sm" data-theme={chat.nametag.theme}>
  {#each chat.messages as message, index (message)}
    {#if message.type === 'text'}
      {#if chat.pending}
        <div in:fly={{ y: 100, delay: index * 50, duration: 150 }}>
          <ChatText {message} />
        </div>
      {:else}
        <ChatText {message} />
      {/if}
    {/if}
    {#if message.type === 'photos' && message.photos.length}
      {#if chat.pending}
        <div in:fly={{ y: 100, delay: index * 50, duration: 150 }}>
          <ChatPhotos {message} />
        </div>
      {:else}
        <ChatPhotos {message} />
      {/if}
    {/if}
    {#if message.type === 'link'}
      {#if chat.pending}
        <div in:fly={{ y: 100, delay: index * 50, duration: 150 }}>
          <ChatLink {message} />
        </div>
      {:else}
        <ChatLink {message} />
      {/if}
    {/if}
  {/each}
  {#if chat.pending}
    <div
      data-padded
      in:fly={{ y: 100, delay: chat.messages.length * 50, duration: 150 }}
    >
      <ChatActions {chat} />
    </div>
  {:else}
    <div data-padded>
      <ChatActions {chat} />
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
