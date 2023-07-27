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
  import Sheet from '$lib/components/Sheet.svelte';
  import { is_standalone } from '$lib/util/is-standalone';
  import SearchButton from '$lib/components/SearchButton.svelte';

  export let data: PageData;

  $: $App.theme = data.my_nametag?.theme || 'system';
  // $: $App.fill = 'system-light';

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
  <h1 slot="left" class="capitalize">
    <Icon icon="near_me" />
    {#if $form.c !== '' || $form.s !== ''}
      {@html [
        $form.c ? `${$form.c.trim()}` : '',
        $form.s ? `<span class="uppercase">${$form.s}</span>` : ''
      ]
        .filter((s) => s !== '')
        .join(', ')}
    {:else}
      Worldwide
    {/if}
  </h1>
  <ButtonRow slot="right">
    <SearchButton />
    <Button
      label="Change"
      icon="near_me"
      on:click={() => ($App.sheet_id = 'wf-filter')}
    />
  </ButtonRow>
  <!-- <WorldfeedNav slot="nav" /> -->
</SiteHeader>

<Main padded={false}>
  <Row padded>
    <h2 slot="left">
      <Icon icon="hail" />
      Pockets
    </h2>
    <Button slot="right" label="Add yours" on:click={handleNewPocketClick} />
  </Row>
  {#if data.worldfeed.pocket_ids.length === 0}
    <Container>
      <div data-flex="v" data-gap>
        <h2 class="half thin">
          Nothing here… <span class="half">yet<em>!</em></span>
        </h2>
      </div>
    </Container>
  {:else}
    <div data-grid data-gap>
      {#each data.worldfeed.pocket_ids as pocket_id (pocket_id)}
        <PocketLoader {pocket_id} />
      {/each}
    </div>
  {/if}
  <Row padded>
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
    <div>
      {#each data.worldfeed.post_ids as post_id (post_id)}
        <Post {post_id} />
      {/each}
    </div>
  {/if}
  <div class="scroll">
    <ButtonRow vertical>
      <Button
        icon="keyboard_arrow_up"
        label=""
        on:click={() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
      <Button
        icon="keyboard_arrow_down"
        label=""
        on:click={() => {
          const main = document.querySelector('main');

          if (!main) return;

          window.scrollTo({
            top:
              main.offsetTop +
              main.offsetHeight -
              window.innerHeight +
              80 +
              (is_standalone ? 28 : 0),
            behavior: 'smooth'
          });
        }}
      />
    </ButtonRow>
  </div>
</Main>

<Sheet id="wf-filter" header="Set location" icon="near_me">
  <form
    id="refine"
    method="get"
    action="/worldfeed"
    bind:this={form_el}
    data-flex="v"
    data-gap="1"
  >
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
      <input type="hidden" name="i" value="US" />
    </div>
    <div>
      <ButtonRow let:controller>
        {#if $form.c.length > 1 || $form.s.length > 1}
          <Button
            type="reset"
            label="Clear"
            icon="clear"
            large
            form="refine"
            disabled={!valid}
            on:click={handleResetClick}
          />
        {/if}
        <Button
          type="submit"
          label="Search"
          icon="keyboard_return"
          primary
          large
          form="refine"
          disabled={!valid}
        />
        {#if $page.data.my_nametag}
          <GetLocation on:location={handleLocationAdded} />
        {/if}
      </ButtonRow>
    </div>
  </form>
</Sheet>

<style lang="scss">
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

  .scroll {
    position: fixed;
    right: 1rem;
    bottom: calc(78px + 1rem + env(safe-area-inset-bottom));
    z-index: 50;
  }
</style>
