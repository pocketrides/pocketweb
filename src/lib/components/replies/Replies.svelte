<script lang="ts">
  import { RepliesManagerStore } from '$lib/stores/RepliesManager';
  import Container from '../Container.svelte';
  import Reply from './Reply.svelte';
</script>

<Container fill="light" padded={false}>
  {#if $RepliesManagerStore.replies?.length}
    <ul data-flex="v" data-unstyle data-fill="system-light">
      {#each $RepliesManagerStore.replies as reply (reply.id)}
        <Reply {reply} />
      {/each}
    </ul>
  {/if}
</Container>
