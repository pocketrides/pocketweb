<script lang="ts">
  import { getSquareSmall } from '$lib/util/cloudinary';
  import type { ServerPocket } from '$lib/zod/Pocket';
  import Icon from './Icon.svelte';
  import PocketRenderer from './pockets/PocketRenderer.svelte';
  import PocketTimeRenderer from './pockets/PocketTimeRenderer.svelte';

  export let pocket: ServerPocket;
  export let mini: boolean = false;
  export let inert: boolean = false;

  const click = (e: MouseEvent) => {
    if (inert) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  let style = pocket.cover_art[0]
    ? `background-image: url(${getSquareSmall(
        pocket.cover_art[0].version,
        pocket.cover_art[0].public_id
      )})`
    : undefined;
</script>

<a
  href={`/pocket/${pocket.id}`}
  data-unstyle
  data-pocket
  class:mini
  data-3d="ah"
  on:click={click}
  data-sveltekit-preload-data={inert ? 'off' : ''}
  data-theme={pocket.theme}
  data-fill="dark"
  data-flex="v je"
  {style}
>
  <p class="strong">{@html pocket.name_html}</p>
  <!--<div data-3d="ah" data-theme={pocket.theme}>
    <PocketRenderer
      summary
      details_enabled={pocket.details_enabled}
      round_last={false}
      default_fill="superlight"
      privacy_mode={pocket.settings.joinability === 'moderated' ||
        pocket.settings.visibility === 'unlisted'}
    >
      <div slot="name" data-padded data-flex="ae">
        <div data-flex="v">
          <div data-flex="v" data-gap>
            {#if pocket.settings.visibility === 'unlisted'}
              <p class="small half">
                <Icon icon="visibility_off" />
                Unlisted
              </p>
            {/if}
            {#if pocket.settings.joinability === 'broadcast'}
              <p class="small half">
                <Icon icon="edit_off" />
                Broadcast Mode
              </p>
            {:else if pocket.settings.joinability === 'moderated'}
              <p class="small half">
                <Icon icon="shield_with_heart" />
                Private Mode
              </p>
            {/if}
          </div>
          <h2>{@html pocket.name_html}</h2>
        </div>
      </div>
      <div slot="time" data-padded>
        <PocketTimeRenderer summary details={pocket.details} />
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
  </div>-->
</a>

<style lang="scss">
  a {
    flex-shrink: 0;
    width: calc(50vw - 0.25rem);
    min-width: 180px;
    max-width: 220px;
    aspect-ratio: 1/1;
    background-position: center center;
    background-size: cover;
    border-color: rgb(var(--base));
    box-shadow: -2px 2px rgb(var(--superdark));
    border-radius: 1rem;
    overflow: hidden;

    &:active {
      transform: translate(-2px, 2px);
    }

    p {
      margin: 0 0 1rem 1rem;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      text-overflow: ellipsis;
      overflow: hidden;
      width: 80%;

      * {
        display: inline;
      }
    }

    // &.mini {
    //   width: 220px;
    //   flex-shrink: 0;
    // }
  }

  // [slot='name'] {
  //   min-height: 128px;

  //   > div {
  //     width: 100%;
  //   }

  //   h2 {
  //     max-width: 90%;

  //     display: -webkit-box;
  //     -webkit-box-orient: vertical;
  //     -webkit-line-clamp: 3;
  //   }
  // }

  // [data-padded] {
  //   padding: 0.4rem 0.5rem;

  //   &:has(+ [data-padded]) {
  //     padding-bottom: 0;
  //   }
  // }

  // [data-3d] {
  //   overflow: hidden;
  // }

  // [data-3d] :global([data-rounded]) {
  //   border-bottom-left-radius: 0.5rem;
  //   border-bottom-right-radius: 0.5rem;
  // }
</style>
