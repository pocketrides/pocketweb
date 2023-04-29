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

  const pockets: CloudinaryPhoto[] = [
    {
      version: 1681421229,
      public_id: 'Homepage/pockets2_qaxya0.png'
    },
    {
      version: 1681421229,
      public_id: 'Homepage/pockets3_flv6dd.png'
    },
    {
      version: 1681421229,
      public_id: 'Homepage/pockets1_bolfuy.png'
    },
    {
      version: 1681421230,
      public_id:
        'Homepage/Simulator_Screenshot_-_iPhone_14_Pro_Max_-_2023-04-13_at_16.16.21_w8o9kd.png'
    }
  ];

  const posts: CloudinaryPhoto[] = [
    {
      version: 1681421230,
      public_id:
        'Homepage/Simulator_Screenshot_-_iPhone_14_Pro_Max_-_2023-04-13_at_16.19.47_nd0z8w.png'
    },
    {
      version: 1681424398,
      public_id:
        'Homepage/Simulator_Screenshot_-_iPhone_14_Pro_Max_-_2023-04-13_at_17.18.20_w6o1qd.png'
    },
    {
      version: 1681421230,
      public_id:
        'Homepage/Simulator_Screenshot_-_iPhone_14_Pro_Max_-_2023-04-13_at_16.17.59_ljnn1a.png'
    }
  ];

  const get_paid: CloudinaryPhoto[] = [
    {
      version: 1681421230,
      public_id:
        'Homepage/Simulator_Screenshot_-_iPhone_14_Pro_Max_-_2023-04-13_at_16.17.59_ljnn1a.png'
    },
    {
      version: 1681421230,
      public_id:
        'Homepage/Simulator_Screenshot_-_iPhone_14_Pro_Max_-_2023-04-13_at_16.21.29_rigqp2.png'
    },
    {
      version: 1681425363,
      public_id:
        'Homepage/Simulator_Screenshot_-_iPhone_14_Pro_Max_-_2023-04-13_at_17.35.05_nkzvbw.png'
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
        The next generation social platform for planning, sharing, and doing. <span
          class="half"
          >Scroll down to see how it works <Icon
            icon="arrow_downward"
            inline
          /></span
        >
      </h2>
    </Container>
    <Container padded={false} fill="system-superlight">
      <Gallery contain square={false} photos={pockets} />
    </Container>
    <Container>
      <h2>
        Start with a Pocket.
        <span class="half"
          >Add everything your group needs to know: time, place, details and links.
          Have your own poster? Yeah we support that.</span
        >
      </h2>
    </Container>
    <Container padded={false} fill="system-superlight">
      <Gallery contain square={false} photos={posts} />
    </Container>
    <Container>
      <h2>
        List it in your town, or search where you're going.
        <span class="half">
          Share great community events on Worldfeed, so everyone searching can find
          it and join too.
        </span>
      </h2>
    </Container>
    <Container padded={false} fill="system-superlight">
      <Gallery contain square={false} photos={get_paid} />
    </Container>
    <Container>
      <h2>
        Invite everyone, it's free to join.
        <span class="half">
          Now you have one place to manage questions or push out updates.</span
        > Share the link on other platforms or send it straight to your group DM.
      </h2>
    </Container>
    <Container padded={false} fill="system-superlight">
      <Gallery contain square={false} photos={get_paid} />
    </Container>
    <Container>
      <h2>
        Share everything that happens in one single place.
        <span class="half"
          >With a group chat and feed, everyone has a place to share the recap.
          Imagine that, all your event's pics in one place.</span
        >
      </h2>
    </Container>
    <Container padded={false} fill="system-superlight">
      <Gallery contain square={false} photos={get_paid} />
    </Container>
    <Container>
      <h2>
        Just like that, your own digital space.
        <span class="half"
          >Want to keep it going? Whether your plans are every week or just for one
          night, it's there whenever you need it.
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
          We think you'll love Nametag Collab. <a href="/unlimited"
            >See how to get started</a
          >.
        </h3>
      </Container>
    </Container>
    <Container>
      <div data-flex="v as" data-gap="1">
        <div>
          <h2 class="half">Oh, and one more thing:</h2>
          <h2>
            Take care of your community and help it to thrive. When you give out a
            like, it&rsquo;s worth cash on Pocketrides.
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
