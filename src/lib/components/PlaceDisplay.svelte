<script lang="ts">
  import { getPlaceLink } from '$lib/util/place';
  import type { GooglePlace } from '$lib/zod/GooglePlace';
  import Icon from './Icon.svelte';

  export let place: GooglePlace;
  export let h2: boolean = true;
  export let h3: boolean = false;
  export let include_address = true;
  export let icon: string | undefined = undefined;
</script>

<div class:h2 class:h3 data-flex="sb ac">
  {#if place.place_id}
    <a
      href={getPlaceLink(place)}
      target="_blank"
      rel="noreferrer"
      data-flex="v"
      data-unstyle
      on:click
    >
      <p>
        <Icon {icon} />
        {place.name}
      </p>
      {#if include_address}
        <div data-flex="sb ab" data-gap>
          <p class="half">
            {place.formatted_address}
          </p>
          <Icon icon="open_in_new" inline half />
        </div>
      {/if}
    </a>
  {:else}
    <p>{place.name || ''}</p>
  {/if}
  <slot />
</div>

<style lang="scss">
  p {
    display: -webkit-box;
    overflow: hidden;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    word-break: break-all;
  }
</style>
