<script lang="ts">
  import type { Writable } from 'svelte/store';
  import Container from '../Container.svelte';
  import Chat from './Chat.svelte';
  import type { ClientChat } from '$lib/zod/Chat';
  import NothingHere from '../NothingHere.svelte';

  export let chats: Writable<ClientChat[]>;
</script>

<Container fill="system-light" padded={false}>
  {#if $chats.length}
    <ul data-flex="v" data-unstyle data-fill="system-light">
      {#each $chats as chat (chat.id)}
        <Chat {chat} />
      {/each}
    </ul>
  {:else}
    <Container>
      <NothingHere />
    </Container>
  {/if}
</Container>

<style lang="scss">
  ul {
    min-height: 320px;
  }
</style>
