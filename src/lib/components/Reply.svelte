<script lang="ts">
  import type { ServerReply } from '$lib/zod/Reply';
  import { afterUpdate } from 'svelte';
  import { writable } from 'svelte/store';
  import { maxLen } from '$lib/util/max-len';
  import Icon from './Icon.svelte';
  import Button from './Button.svelte';
  import Nametag from './Nametag.svelte';

  export let reply: ServerReply;
  export let initial: 'preview' | 'expanded' = 'expanded';

  const controller = writable({
    display_mode: initial
  });

  afterUpdate(() => {
    $controller.display_mode = initial;
  });
</script>

{#if $controller.display_mode === 'preview'}
  <div data-flex="sb" data-gap>
    <p>
      <a href={`/profile/${reply.nametag.id}`} class="h3" data-unstyle>
        {reply.nametag.nametag}
      </a>
      {maxLen(reply.content)}
    </p>
    <div>
      <button>
        <Icon icon="favorite_border" />
        {reply.stats.likes}
      </button>
    </div>
  </div>
{:else}
  <div data-flex="v as" data-theme={reply.nametag.theme}>
    <div class="bubble" data-fill="superlight" data-flex="v" data-gap>
      <p>{reply.content}</p>
      <div data-flex="ac" data-gap>
        <Nametag nametag={reply.nametag} />
        <button>
          <Icon icon="favorite_border" />
          {reply.stats.likes}
        </button>
      </div>
    </div>
  </div>
{/if}

<style lang="scss">
  .bubble {
    border-radius: 1rem;
    padding: 1rem;
    background-color: rgba(var(--superlight), 0.25);
  }
</style>
