<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import Button from '$lib/components/Button.svelte';
  import ButtonRow from '$lib/components/ButtonRow.svelte';
  import Container from '$lib/components/Container.svelte';
  import Icon from '$lib/components/Icon.svelte';
  import Main from '$lib/components/Main.svelte';
  import NothingHere from '$lib/components/NothingHere.svelte';
  import Post from '$lib/components/Post.svelte';
  import Row from '$lib/components/Row.svelte';
  import SiteHeader from '$lib/components/SiteHeader.svelte';
  import UtilityNav from '$lib/components/UtilityNav.svelte';
  import PocketLoader from '$lib/components/pockets/PocketLoader.svelte';
  import WorldfeedNav from '$lib/components/worldfeed/WorldfeedNav.svelte';
  import { App } from '$lib/stores/app';
  import { z } from 'zod';
  import type { PageData } from './$types';
  import { writable } from 'svelte/store';
  import GetLocation from './ui/GetLocation.svelte';
  import type { WorldfeedLocation } from '$lib/zod/Worldfeed';
  import { tick } from 'svelte';

  export let data: PageData;

  $: $App.theme = data.my_nametag?.theme || 'system';
  $: $App.fill = 'system-superlight';

  const form_validator = z.object({
    c: z.string(),
    s: z.string().max(2),
    i: z.string().min(2).max(2)
  });

  $: form = writable<z.infer<typeof form_validator>>({
    c: $page.url.searchParams.get('c') || '',
    s: $page.url.searchParams.get('s') || '',
    i: 'US'
  });

  $: valid = form_validator.safeParse($form).success;

  let form_el: HTMLFormElement;

  const handleNewPocketClick = () => {
    if ($page.data.my_nametag) {
      goto('/pocket');
    } else {
      $App.sheet_id = 'onboarding';
    }
  };

  const handleResetClick = async (e: MouseEvent) => {
    e.preventDefault();

    form.update((prev) => {
      prev.c = '';
      prev.s = '';
      prev.i = 'US';

      return prev;
    });

    await tick();

    if (form_el) form_el.submit();
  };

  const handleLocationAdded = async (e: CustomEvent<WorldfeedLocation>) => {
    $form.c = e.detail.city || '';
    $form.s = e.detail.state || '';
    $form.i = e.detail.country || '';

    await tick();

    if (form_el) form_el.submit();
  };
</script>

<svelte:head>
  <title>Worldfeed | on Pocketrides!</title>
  <meta property="og:title" content="Worldfeed" />
  <meta property="og:description" content="The best content on Pocketrides." />
</svelte:head>

<SiteHeader huddable>
  <WorldfeedNav slot="nav" />
</SiteHeader>

<Main padded={false} fill="system-light">
  <Row padded bordered fill="system-light">
    <h2 slot="left">
      <Icon icon="hail" />
      Pockets
    </h2>
    <Button slot="right" label="Add yours" on:click={handleNewPocketClick} />
  </Row>
  {#if data.worldfeed.pocket_ids.length === 0}
    <Container>
      <div data-flex="v" data-gap>
        <h2 class="half">Nothing here… <span class="half">yet<em>!</em></span></h2>
      </div>
    </Container>
  {:else}
    <div data-flex="scroll-h" data-gap>
      {#each data.worldfeed.pocket_ids as pocket_id (pocket_id)}
        <PocketLoader {pocket_id} />
      {/each}
    </div>
  {/if}
  <Row padded bordered fill="system-light">
    <h2 slot="left">
      <Icon icon="signpost" />
      Posts
    </h2>
  </Row>
  {#if data.worldfeed.post_ids.length === 0}
    <Container>
      <NothingHere />
    </Container>
  {:else}
    {#each data.worldfeed.post_ids as post_id (post_id)}
      <Post {post_id} />
    {/each}
  {/if}
  <UtilityNav slot="utility-nav">
    <form id="refine" method="get" action="/worldfeed" bind:this={form_el}>
      <div data-button-row>
        <input
          type="search"
          name="c"
          data-3d
          class="h3"
          class:filled={$form.c.length > 0}
          bind:value={$form.c}
          placeholder="City"
        />
        <input
          type="search"
          name="s"
          data-3d
          class="h3"
          class:filled={$form.s.length > 0}
          bind:value={$form.s}
          placeholder="State"
        />
        {#if $page.data.my_nametag}
          <GetLocation on:location={handleLocationAdded} />
        {/if}
        {#if $form.c.length > 1 || $form.s.length > 1}
          <Button
            type="reset"
            label=""
            icon="clear"
            large
            form="refine"
            disabled={!valid}
            on:click={handleResetClick}
          />
        {/if}
        <Button
          type="submit"
          label=""
          icon="keyboard_return"
          primary
          form="refine"
          disabled={!valid}
        />
        <input type="hidden" name="i" value="US" />
      </div>
    </form>
  </UtilityNav>
</Main>

<style lang="scss">
  [data-flex='scroll-h'] {
    padding: 1rem;
    scroll-padding: 1rem;
    align-items: flex-end;

    :global(> *) {
      scroll-snap-align: start;
    }
  }

  [data-button-row] {
    input {
      display: inline-flex;
      flex-grow: 0;
      width: 33%;

      &[name='c'] {
        flex-grow: 1;
      }

      &[name='s'] {
        flex-grow: 0;
        max-width: 5rem;
      }
    }
  }
</style>
