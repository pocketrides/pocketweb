<script lang="ts">
  import { SearchRequest, type SearchResponse } from '$lib/api/search/search';
  import Button from '$lib/components/Button.svelte';
  import ButtonRow from '$lib/components/ButtonRow.svelte';
  import NametagWithPic from '$lib/components/NametagWithPic.svelte';
  import PocketDisplay from '$lib/components/PocketDisplay.svelte';
  import Sheet from '$lib/components/Sheet.svelte';
  import { writable } from 'svelte/store';
  import { z } from 'zod';

  const searching = writable(false);
  const has_searched = writable(false);
  const results = writable<SearchResponse>({
    success: true,
    nametags: [],
    pockets: []
  });

  let q: string = '';
  let interval_id: any;

  $: valid = z.string().min(1).max(64).safeParse(q).success;

  const handleSubmit = async () => {
    if (q === '') return;
    $searching = true;
    $results = await SearchRequest.search(q);
    $has_searched = true;
    $searching = false;
  };

  const handleReset = () => {
    $has_searched = false;
    q = '';
    $results = {
      success: true,
      nametags: [],
      pockets: []
    };
  };

  const handleKeyup = () => {
    clearInterval(interval_id);
    interval_id = setInterval(() => {
      clearInterval(interval_id);
      handleSubmit();
    }, 500);
  };
</script>

<Sheet id="search" icon="search" header="Search" close="Done" padded={false}>
  <div data-flex="v" data-gap="1">
    <form on:submit|preventDefault={handleSubmit} data-padded data-flex="v" data-gap>
      <input
        type="search"
        data-3d
        name="q"
        class="h3"
        placeholder="Search Pocketrides…"
        aria-label="Search pocketrides by nametag or pocket name"
        bind:value={q}
        class:filled={valid}
        on:keyup={handleKeyup}
      />
      <ButtonRow>
        {#if $results.nametags.length || $results.pockets.length}
          <Button icon="clear" label="" large on:click={handleReset} />
        {/if}
        <Button
          id="search"
          type="submit"
          icon={$searching ? 'refresh' : 'keyboard_return'}
          label={$searching ? 'One sec!' : 'Search'}
          icon_spins={$searching}
          primary
          large
          disabled={!valid || $searching}
        />
      </ButtonRow>
    </form>

    {#if $results.nametags.length}
      <div data-flex="v" data-gap>
        <h2 data-padded="h">Nametags</h2>
        <ul data-flex="scroll-h" data-gap data-unstyle>
          {#each $results.nametags as nametag (nametag)}
            <li>
              <NametagWithPic {nametag} large />
            </li>
          {/each}
        </ul>
      </div>
    {/if}
    {#if $results.pockets.length}
      <div data-flex="v" data-gap>
        <h2 data-padded="h">Pockets</h2>
        <ul data-flex="scroll-h" data-gap data-unstyle>
          {#each $results.pockets as pocket (pocket)}
            <li>
              <PocketDisplay {pocket} />
            </li>
          {/each}
        </ul>
      </div>
    {/if}
    {#if !$results.nametags.length && !$results.pockets.length && $has_searched}
      <div data-padded="h">
        <h2>No results.</h2>
      </div>
    {/if}
    {#if $results.success === false}
      <div data-flex="v as" data-padded="h">
        <div data-error>
          Something went wrong. <span class="half">Try again!</span>
        </div>
      </div>
    {/if}
  </div>
</Sheet>

<style lang="scss">
  // input[type='search'] {
  //   flex-grow: 1;
  // }

  ul {
    padding-left: 1rem;
    padding-right: 1rem;
    padding-bottom: 1px;
  }
</style>
