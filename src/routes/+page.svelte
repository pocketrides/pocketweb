<script lang="ts">
  import { page } from '$app/stores';
  import Button from '$lib/components/Button.svelte';
  import Container from '$lib/components/Container.svelte';
  import Gallery from '$lib/components/Gallery.svelte';
  import Icon from '$lib/components/Icon.svelte';
  import Logo from '$lib/components/Logo.svelte';
  import Main from '$lib/components/Main.svelte';
  import Sheet from '$lib/components/Sheet.svelte';
  import SiteHeader from '$lib/components/SiteHeader.svelte';
  import UtilityNav from '$lib/components/UtilityNav.svelte';
  import WorldfeedNav from '$lib/components/worldfeed/WorldfeedNav.svelte';
  import Subscription from '$lib/forms/subscription/Subscription.svelte';
  import { App } from '$lib/stores/app';
  import type { CloudinaryPhoto } from '$lib/zod/CloudinaryPhoto';
  import { onMount } from 'svelte';
  import { fly } from 'svelte/transition';

  $: $App.theme = 'system';
  $: $App.fill = 'system-superlight';

  $: ready = false;

  onMount(() => {
    ready = true;
  });

  const pocket_hero: CloudinaryPhoto[] = [
    {
      version: 1683918384,
      public_id: 'Homepage/freshest/pocket-hero-v2_zx7bpg.png'
    }
  ];

  const worldfeed_hero: CloudinaryPhoto[] = [
    {
      version: 1683510786,
      public_id: 'Homepage/freshest/worldfeed-hero_ey0da8.png'
    }
  ];
  const payouts_hero: CloudinaryPhoto[] = [
    {
      version: 1683918384,
      public_id: 'Homepage/freshest/payouts-hero_kz941y.png'
    }
  ];
</script>

<svelte:head>
  <title>welcome welcome! it's pocketrides!</title>
  <meta
    name="description"
    content="The all-in-one group messaging platform and digital town square."
  />
</svelte:head>

<SiteHeader huddable>
  <WorldfeedNav slot="nav" />
</SiteHeader>
<Main fullheight padded={false}>
  <div data-flex="v" data-gap="1">
    <Container>
      <Container rounded fill="system-superlight">
        <div class="card" data-flex="ae">
          <div data-flex="v">
            <h1 data-flex="v">
              {#if ready}
                <span in:fly|local={{ y: 50, duration: 550 }}>
                  <Logo />
                </span>
                <span
                  class="half"
                  in:fly|local={{ y: 50, duration: 550, delay: 75 }}
                >
                  Living life in a group text?
                </span>
                <span
                  class="jumbo"
                  in:fly|local={{ y: 50, duration: 550, delay: 75 }}
                >
                  Meet Pocketrides<em>!</em>
                </span>
              {/if}
            </h1>
          </div>
        </div>
      </Container>
    </Container>
    <Container>
      <h2>
        The all-in-one group messaging platform and digital town square.
        <span class="half"
          >Here’s how it works <Icon icon="arrow_downward" inline /></span
        >
      </h2>
    </Container>
    <Container padded={false} fill="system-superlight">
      <Gallery contain square={false} photos={pocket_hero} />
    </Container>
    <Container>
      <h2>
        Start with a Pocket.
        <span class="half">
          It has everything your group needs to plan anything: all the details live
          at the top, there’s a home feed for everyone to post, and a group chat to
          shoot the breeze.
        </span>
      </h2>
    </Container>
    <Container padded={false} fill="system-superlight">
      <Gallery contain square={false} photos={worldfeed_hero} />
    </Container>
    <Container>
      <h2>
        Find stuff to do.
        <span class="half">
          <a href="/worldfeed">Worldfeed</a> is your new guide around town: find Pockets
          to join or browse posts from everyone. (It’s great for finding stuff to do in
          a new city, too.)
        </span>
      </h2>
    </Container>
    <Container padded={false} fill="system-superlight">
      <Gallery contain square={false} photos={payouts_hero} />
    </Container>
    <Container>
      <div data-flex="v as" data-gap>
        <h2>
          Support your community.
          <span class="half">
            Everyone earns a cent per like on Pocketrides: so we can take care of
            each other and reward our creativity in a whole new way.
          </span>
        </h2>
        <Button
          label="Read more"
          on:click={() => {
            $App.sheet_id = 'creator_program';
          }}
        />
      </div>
    </Container>
    <Container>
      <Container rounded fill="base">
        <h2>Unlimited is $5/mo.</h2>
        <h3>
          Make one Pocket for free and join up to three, no subscription required.
        </h3>
      </Container>
      <Container rounded fill="superdark">
        <h2>Using Pocketrides as a business or organization?</h2>
        <h3>
          We think you'll love <a href="/unlimited">Nametag Collab</a>.
        </h3>
      </Container>
    </Container>
  </div>
  <UtilityNav slot="utility-nav">
    <div slot="left">
      {#if !$page.data.my_nametag}
        <Button
          label="Get free account"
          icon="hail"
          system
          on:click={() => ($App.sheet_id = 'onboarding')}
        />
      {:else}
        <Button
          label="Go back"
          icon="arrow_back_ios"
          on:click={() => history.go(-1)}
        />
      {/if}
    </div>
  </UtilityNav>
</Main>

<Sheet id="creator_program" header="How Likes work" icon="favorite" icon_filled>
  <Subscription
    on:complete={() => {
      $App.sheet_id = '';
    }}
  />
</Sheet>

<style lang="scss">
  .card {
    aspect-ratio: 4/3;
    max-height: 240px;
    width: 100%;
    position: relative;

    @media (min-width: 640px) {
      max-height: 380px;
    }

    > *:not(img) {
      position: relative;
      z-index: 1;
    }

    [data-flex='v'] {
      width: 100%;
    }
  }
</style>
