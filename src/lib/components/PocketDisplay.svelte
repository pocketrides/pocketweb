<script lang="ts">
  import type { ServerPocket } from '$lib/zod/Pocket';
  import Icon from './Icon.svelte';
  import PocketRenderer from './pockets/PocketRenderer.svelte';

  export let pocket: ServerPocket;
</script>

<a href={`/pocket/${pocket.id}`} data-unstyle>
  <div data-3d="ah" data-theme={pocket.theme}>
    <PocketRenderer details_enabled={pocket.details_enabled} default_fill="base">
      <div slot="name" data-padded data-flex="ae">
        <h2>{@html pocket.name_html}</h2>
      </div>
      <div data-fill="base" data-padded>
        <p class="h2" data-gap="sm">
          See details
          <Icon icon="arrow_right" />
        </p>
      </div>
    </PocketRenderer>
  </div>
</a>

<style lang="scss">
  a {
    width: calc(50% - 0.25rem);
  }

  [slot='name'] {
    min-height: 128px;

    h2 {
      max-width: 80%;
    }
  }

  [data-padded] {
    padding: 0.5rem;
  }

  [data-3d] :global([data-rounded]) {
    border-bottom-left-radius: 0.5rem;
    border-bottom-right-radius: 0.5rem;
  }
</style>
