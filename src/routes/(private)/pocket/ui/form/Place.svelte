<script lang="ts">
  import Button from '$lib/components/Button.svelte';
  import Container from '$lib/components/Container.svelte';
  import Icon from '$lib/components/Icon.svelte';
  import PlaceSearch from '$lib/components/PlaceSearch.svelte';
  import Row from '$lib/components/Row.svelte';
  import { getPlaceLink } from '$lib/util/place';
  import type { GooglePlace } from '$lib/zod/GooglePlace';
  import type { DraftPocket } from '$lib/zod/Pocket';
  import type { Writable } from 'svelte/store';
  import { page_label } from '../store';
  import PlaceDisplay from '$lib/components/PlaceDisplay.svelte';

  export let page_controller: Writable<DraftPocket>;

  let place = $page_controller.details.place || {
    name: ''
  };

  $: $page_controller.details.place = place;

  const handlePlaceSelected = (e: CustomEvent<GooglePlace>) => {
    place = e.detail;
  };

  const deleteClick = () => {
    page_controller.update((prev) => {
      prev.details_enabled.splice(prev.details_enabled.indexOf('place'), 1);
      delete prev.details.place;

      return prev;
    });
  };
</script>

<Container bottombordered>
  <div data-flex="v" data-gap>
    <Row>
      <h2 slot="left">
        <Icon icon="place" />
        <label for="place-search">Location</label>
      </h2>
      <Button
        slot="right"
        icon="delete"
        label="Remove"
        on:click={deleteClick}
        controller={page_label}
      />
    </Row>
    {#if place && place.name !== ''}
      <PlaceDisplay {place} />
    {:else}
      <PlaceSearch on:selected={handlePlaceSelected} />
    {/if}
  </div>
</Container>
