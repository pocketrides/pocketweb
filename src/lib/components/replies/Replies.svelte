<script lang="ts">
  import { RepliesManagerStore } from '$lib/stores/replies';
  import Container from '../Container.svelte';
  import Reply from './Reply.svelte';
</script>

<Container padded={false}>
  {#if $RepliesManagerStore.replies?.length}
    <ul data-flex="v" data-unstyle>
      {#each $RepliesManagerStore.replies as reply (reply.id)}
        <Reply {reply} />
      {/each}
    </ul>
  {:else}
    <div data-padded>
      <p class="h3 half">No replies… <span class="half">yet<em>!</em></span></p>
    </div>
  {/if}
</Container>
