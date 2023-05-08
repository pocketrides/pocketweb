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
      version: 1683510786,
      public_id: 'Homepage/freshest/pocket-hero_xita0a.png'
    }
  ];

  const worldfeed_hero: CloudinaryPhoto[] = [
    {
      version: 1683510786,
      public_id: 'Homepage/freshest/worldfeed-hero_ey0da8.png'
    }
  ];
  const invite_hero: CloudinaryPhoto[] = [
    {
      version: 1683510786,
      public_id: 'Homepage/freshest/your-space-hero_xxra5z.png'
    }
  ];
  const space_hero: CloudinaryPhoto[] = [
    {
      version: 1683510786,
      public_id: 'Homepage/freshest/pocket-features-hero_xsux9w.png'
    }
  ];
</script>

<svelte:head>
  <title>welcome welcome! it's pocketrides!</title>
  <meta
    name="description"
    content="A place for groups of all sizes to plan things together."
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
                  Hello hello! You&rsquo;re on
                </span>
                <span
                  class="jumbo"
                  in:fly|local={{ y: 50, duration: 550, delay: 75 }}
                >
                  Pocketrides<em>!</em>
                </span>
              {/if}
            </h1>
          </div>
        </div>
      </Container>
    </Container>
    <Container>
      <h2>
        Your digital town square for planning, sharing, and doing. <span class="half"
          >See how it works in four steps <Icon icon="arrow_downward" inline />
        </span>
      </h2>
    </Container>
    <Container padded={false} fill="system-superlight">
      <Gallery contain square={false} photos={pocket_hero} />
    </Container>
    <Container>
      <h2>
        Start with a Pocket.
        <span class="half">
          A self-contained social network for your group, they’re great at planning
          stuff with a time and a place.
        </span>
      </h2>
    </Container>
    <Container padded={false} fill="system-superlight">
      <Gallery contain square={false} photos={worldfeed_hero} />
    </Container>
    <Container>
      <h2>
        Add it to the Worldfeed.
        <span class="half">
          It’s a digital town square for finding stuff to do where you live (or wanna
          travel to).
        </span>
      </h2>
    </Container>
    <Container padded={false} fill="system-superlight">
      <Gallery contain square={false} photos={space_hero} />
    </Container>
    <Container>
      <h2>
        Invite everyone to join.
        <span class="half">
          It’s free to join three pockets, then unlimited is $5/mo.
        </span>
      </h2>
    </Container>
    <Container padded={false} fill="system-superlight">
      <Gallery contain square={false} photos={invite_hero} />
    </Container>
    <Container>
      <h2>
        Your group’s new digital space!
        <span class="half">
          Pockets are yours forever. No ads and no ongoing subscription required.
        </span>
      </h2>
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
        <h3 class="half">
          We think you'll love <a href="/unlimited">Nametag Collab</a>.
        </h3>
      </Container>
    </Container>
    <Container>
      <div data-flex="v as" data-gap="1">
        <div>
          <h2 class="half">Oh, and one more thing:</h2>
          <h2>
            Take care of your community and help it thrive. When you give out a like,
            it’s worth cash on Pocketrides
          </h2>
        </div>
        <Button
          label="Read more"
          on:click={() => {
            $App.sheet_id = 'creator_program';
          }}
        />
      </div>
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
      max-height: 400px;
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
