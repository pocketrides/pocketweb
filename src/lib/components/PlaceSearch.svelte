<script lang="ts">
  import { PlaceSearchRequest } from '$lib/api/place/search';
  import { getPlaceLink } from '$lib/util/place';
  import type { GooglePlace } from '$lib/zod/GooglePlace';
  import { createEventDispatcher } from 'svelte';
  import { writable } from 'svelte/store';
  import Button from './Button.svelte';
  import PlaceDisplay from './PlaceDisplay.svelte';

  export let show_hint = true;

  const dispatch = createEventDispatcher();
  const searching = writable(false);

  const results = writable<GooglePlace[]>([]);
  let interval_id: any;
  let value: string = '';
  let cache: { [key: string]: GooglePlace[] } = {};

  $: has_searched = false;

  const handleSearch = async () => {
    if ($searching) return;
    clearInterval(interval_id);
    interval_id = setInterval(async () => {
      clearInterval(interval_id);
      $searching = true;

      has_searched = true;

      const query = value.toString();

      if (query === '') {
        $results = [];
        $searching = false;
        return;
      }

      if (cache[query]) {
        $results = cache[query];
        $searching = false;
        return;
      }

      const res = await PlaceSearchRequest.search(query);

      if (res.success) {
        if (value === query) {
          $results = res.places;
          cache[query] = res.places;
        }
      }

      $searching = false;
    }, 500);
  };
</script>

<div data-flex="v" data-gap>
  <form on:submit|preventDefault={handleSearch} data-flex="sb" data-gap>
    <input
      type="search"
      id="place-search"
      data-3d
      class="h2"
      placeholder="Start typing…"
      name="address"
      class:filled={value !== ''}
      bind:value
      on:input={handleSearch}
    />
    <Button
      type="submit"
      icon={$searching ? 'autorenew' : 'keyboard_return'}
      icon_spins={$searching}
      disabled={$searching || value === ''}
      label={$searching ? 'Searching…' : 'Search'}
      large
    />
  </form>
  <ul aria-live="polite" role="region" aria-atomic="true" data-unstyle>
    {#each $results as result (result)}
      <li>
        <PlaceDisplay
          place={result}
          on:click={(e) => {
            e.preventDefault();
            dispatch('selected', result);
          }}
        >
          <Button
            label="Select"
            on:click={() => {
              dispatch('selected', result);
            }}
          />
        </PlaceDisplay>
      </li>
    {/each}
    {#if has_searched && !$searching}
      <li class="half" data-ph>
        <a
          href="#none"
          data-unstyle
          data-flex="as"
          on:click|preventDefault={() => {
            dispatch('selected', {
              name: value
            });
          }}
        >
          <p class="h3">Use "{value}" instead…</p>
        </a>
      </li>
    {/if}
    {#if show_hint && value === ''}
      <li class="h3 half">Search for an address or place.</li>
    {/if}
  </ul>
</div>

<style lang="scss">
  input[type='search'] {
    width: 100%;
  }
</style>
