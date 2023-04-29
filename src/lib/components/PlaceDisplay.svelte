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

<div class:h2 class:h3 data-flex="sb ac" data-gap="1">
  {#if place.place_id}
    <a
      href={getPlaceLink(place)}
      target="_blank"
      rel="noreferrer"
      data-flex="v"
      data-unstyle
      on:click
    >
      <p class="nowraps">
        <Icon {icon} />
        {place.name}
      </p>
      {#if include_address}
        <p class="half small">
          {place.formatted_address}
        </p>
      {/if}
    </a>
  {:else}
    <p class="nowraps">{place.name || ''}</p>
  {/if}
  <slot />
</div>
