<script lang="ts">
  import type { ServerPocket } from '$lib/zod/Pocket';
  import Icon from './Icon.svelte';
  import PocketRenderer from './pockets/PocketRenderer.svelte';
  import PocketTimeRenderer from './pockets/PocketTimeRenderer.svelte';

  export let pocket: ServerPocket;
</script>

<a href={`/pocket/${pocket.id}`} data-unstyle data-pocket>
  <div data-3d="ah" data-theme={pocket.theme}>
    <PocketRenderer
      summary
      details_enabled={pocket.details_enabled}
      round_last={false}
      default_fill="superlight"
    >
      <div slot="name" data-padded data-flex="ae">
        <h2>{@html pocket.name_html}</h2>
      </div>
      <div slot="time" data-padded>
        <PocketTimeRenderer h3 summary details={pocket.details} />
      </div>
      <div slot="desc" data-padded>
        <div class="h3 nowraps">{@html pocket.details.desc_html || ''}</div>
      </div>
      <div slot="place" data-padded>
        <h3 class="nowraps">{pocket.details.place?.name || ''}</h3>
      </div>
      <div data-fill="superlight" data-padded>
        <p class="h3" data-gap="0">
          All details
          <Icon icon="arrow_right_alt" />
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
      max-width: 90%;

      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 3;
    }
  }

  [data-padded] {
    padding: 0.4rem 0.5rem;

    &:has(+ [data-padded]) {
      padding-bottom: 0;
    }
  }

  [data-3d] {
    overflow: hidden;
  }

  [data-3d] :global([data-rounded]) {
    border-bottom-left-radius: 0.5rem;
    border-bottom-right-radius: 0.5rem;
  }
</style>
