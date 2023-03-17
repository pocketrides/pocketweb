<script lang="ts">
  import { App } from '$lib/stores/app';
  import type { ClientReply } from '$lib/zod/Reply';
  import { fly } from 'svelte/transition';
  import Nametag from '../Nametag.svelte';
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
  {/each}
  {#if reply.pending}
    <div in:fly={{ y: 100, delay: reply.messages.length * 50, duration: 150 }}>
      <Nametag
        nametag={reply.nametag}
        tiny
        on:click={() => {
          $App.sheet_id = '';
        }}
      />
    </div>
  {:else}
    <div>
      <Nametag
        nametag={reply.nametag}
        tiny
        on:click={() => {
          $App.sheet_id = '';
        }}
      />
    </div>
  {/if}
</li>

<style lang="scss">
  li {
    padding: 0.5rem 0;
    align-items: flex-start;
  }

  li :global([data-padded]) {
    padding: 0;
  }
</style>
