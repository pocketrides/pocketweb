<script lang="ts">
  import { WorldfeedGeoLookupRequest } from '$lib/api/worldfeed/geo';
  import Button from '$lib/components/Button.svelte';
  import Checkbox from '$lib/components/Checkbox.svelte';
  import { App } from '$lib/stores/app';
  import { writable, type Writable } from 'svelte/store';
  import { formatWorldfeedLocation } from '$lib/util/worldfeed';
  import Icon from '$lib/components/Icon.svelte';
  import type { DraftPocket } from '$lib/zod/Pocket';

  export let page_controller: Writable<DraftPocket>;

  const error = writable(false);
  const adding = writable(false);

  const handleAddClick = () => {
    $adding = true;

    navigator.geolocation.getCurrentPosition(
      async (position: GeolocationPosition) => {
        $adding = true;

        const res = await WorldfeedGeoLookupRequest.post({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });

        $adding = false;

        if (res.success && res.location) {
          $error = false;
          $page_controller.settings.worldfeed = res.location;
        } else {
          $error = true;
          $page_controller.settings.worldfeed = null;
        }
      },
      () => {
        $adding = false;
        $error = true;
        $page_controller.settings.worldfeed = null;
      },
      { timeout: 5000 }
    );
  };

  const handleRemoveClick = () => {
    $page_controller.settings.worldfeed = null;
  };
</script>

{#if $page_controller.settings.worldfeed}
  <div data-flex="v" data-gap>
    <div data-flex="sb" data-gap>
      <Checkbox
        checked
        label="Add to Worldfeed"
        labelled_by="loc"
        on:change={handleRemoveClick}
      />
      <div class="half">
        <Button
          icon="help"
          label="Help"
          transparent
          on:click={() => {
            $App.sheet_id = 'worldfeed_help';
          }}
        />
      </div>
    </div>
    <p id="loc" class="h3">
      <Icon icon="public" />
      {formatWorldfeedLocation($page_controller.settings.worldfeed)}
    </p>
  </div>
{:else if $error === false}
  <div data-flex="sb" data-gap>
    {#if $adding}
      <Button icon="refresh" icon_spins label="Getting location…" disabled />
    {:else}
      <Checkbox
        checked={false}
        label="Add to Worldfeed"
        on:change={handleAddClick}
      />
    {/if}
    <div class="half">
      <Button
        icon="help"
        label="Help"
        transparent
        on:click={() => {
          $App.sheet_id = 'worldfeed_help';
        }}
      />
    </div>
  </div>
{:else}
  <div>
    <h3>
      Couldn't get location. <a
        href="#try-again"
        class="half"
        on:click|preventDefault={() => {
          $error = false;
        }}>Try again?</a
      >
    </h3>
  </div>
{/if}
