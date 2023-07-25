<script lang="ts">
  import { getPlaceLink } from '$lib/util/place';
  import type { GooglePlace } from '$lib/zod/GooglePlace';
  import Icon from './Icon.svelte';

  export let place: GooglePlace;
  export let include_address = true;
  export let icon: string | undefined = undefined;
</script>

<div data-flex="v">
  <p class="small half strong">
    <Icon {icon} />
    Location
  </p>
  {#if place.place_id}
    <a
      href={getPlaceLink(place)}
      target="_blank"
      rel="noreferrer"
      on:click
      data-flex="nowraps"
      data-gap
      data-unstyle
    >
      <span class="strong">
        <u>{place.name}</u>
      </span>
      {#if include_address}
        <span class="half nowraps">
          {place.formatted_address}
        </span>
      {/if}
    </a>
  {:else}
    <p class="nowraps">{place.name || ''}</p>
  {/if}
  <slot />
</div>
