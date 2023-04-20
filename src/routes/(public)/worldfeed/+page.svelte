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

  export let data: PageData;

  $: $App.theme = data.my_nametag?.theme || 'system';
  $: $App.fill = 'system-superlight';

  const form_validator = z.object({
    c: z.string().min(1),
    s: z.string().max(2),
    i: z.literal('US')
  });

  const form = writable<z.infer<typeof form_validator>>({
    c: $page.url.searchParams.get('c') || '',
    s: $page.url.searchParams.get('s') || '',
    i: 'US'
  });

  $: valid = form_validator.safeParse($form).success;

  const handleNewPocketClick = () => {
    if ($page.data.my_nametag) {
      goto('/pocket');
    } else {
      $App.sheet_id = 'onboarding';
    }
  };

  const handleSubmit = () => {};
</script>

<svelte:head>
  <title>Worldfeed | on Pocketrides!</title>
  <meta
    property="og:description"
    content="Explore the best content on Pocketrides."
  />
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
        <p class="half">
          Planning something? <a
            href="#list-it-here"
            on:click|preventDefault={handleNewPocketClick}
          >
            List it here</a
          >{#if !$page.data.my_nametag}&nbsp;with a free Pocketrides account{/if}.
        </p>
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
    <form slot="left" id="refine" method="get" action="/worldfeed">
      <ButtonRow>
        <input
          type="search"
          data-3d
          class="h3"
          name="c"
          class:filled={$form.c.length > 0}
          bind:value={$form.c}
          placeholder="City"
        />
        <input
          type="search"
          data-3d
          class="h3"
          name="s"
          class:filled={$form.s.length > 0 && $form.s.length < 3}
          bind:value={$form.s}
          placeholder="State"
        />
        <input type="hidden" name="i" value="US" />
      </ButtonRow>
    </form>
    <ButtonRow slot="right">
      {#if $form.c.length || $form.s.length}
        <Button
          type="reset"
          label=""
          icon="clear"
          large
          form="refine"
          on:click={() => {}}
        />
      {/if}
      <Button type="submit" label="" icon="keyboard_return" large form="refine" />
    </ButtonRow>
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

  [name='c'] {
    max-width: 10rem;
  }

  [name='s'] {
    width: 5rem;
  }
</style>
