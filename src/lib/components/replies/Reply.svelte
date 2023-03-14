<script lang="ts">
  import type { ClientReply } from '$lib/zod/Reply';
  import { slide } from 'svelte/transition';
  import Nametag from '../Nametag.svelte';
  import ReplyText from './ReplyText.svelte';

  export let reply: ClientReply;
</script>

<li
  class:pending={reply.pending}
  data-flex="v"
  data-gap="sm"
  data-theme={reply.nametag.theme}
>
  {#each reply.messages as message (message)}
    {#if message.type === 'text'}
      {#if reply.pending}
        <div in:slide>
          <ReplyText {message} />
        </div>
      {:else}
        <ReplyText {message} />
      {/if}
    {/if}
  {/each}
  <div data-padded>
    <Nametag nametag={reply.nametag} />
  </div>
</li>

<style lang="scss">
  li {
    padding: 0.5rem 0;
    align-items: flex-start;
  }

  li :global([data-padded]) {
    padding: 0 1rem;
  }
</style>
