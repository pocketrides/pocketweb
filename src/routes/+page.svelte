<script lang="ts">
  import { page } from '$app/stores';
  import Button from '$lib/components/Button.svelte';
  import CloudinaryImg from '$lib/components/CloudinaryImg.svelte';
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
  import { trackGoal } from 'fathom-client';
  import { onMount } from 'svelte';
  import { fly } from 'svelte/transition';

  $: $App.theme = 'system';
  $: $App.fill = 'system-superlight';

  $: ready = false;

  onMount(() => {
    ready = true;
  });

  const whyClick = () => {
    $App.sheet_id = 'why_pocketrides';
    trackGoal('JGGYLBWK', 1);
  };

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
  <title>life's a ride, keep up on pocketrides!</title>
  <meta
    name="description"
    content="Build community like a local on Pocketrides: the all-in-one platform for groups, and a digital town square to find stuff to do locally."
  />
</svelte:head>

<SiteHeader huddable>
  <WorldfeedNav slot="nav" />
</SiteHeader>
<Main fullheight padded={false}>
  <Container padded={false}>
    <div class="card">
      <h1 class="jumbo" data-h>
        Build community like a local <span class="half"
          >on Pocketrides<em>!</em></span
        >
      </h1>
      <h2 class="h1 thin">
        The only platform designed to help your community thrive.
      </h2>
      <CloudinaryImg photo={pocket_hero[0]} square />
    </div>
    <div class="card">
      <h2 class="h1" data-h>
        Directly support <span class="half" data-nobreak
          >the local artists, activists, community champions, small business owners
          and storytellers
        </span> making your town a great place to live.
      </h2>
      <p class="h2 thin">
        No matter how you participate in your community, your creativity has a new
        home on Pocketrides.
      </p>
    </div>
    <div class="how-it-works" data-fill="system-dark">
      <h2 class="h1">Here's how it works:</h2>
      <ul data-flex="scroll-h" data-unstyle data-gap>
        <li data-fill="system-superlight">
          <p class="h3">Step 1:</p>
          <h2 class="h1">Start with a pocket.</h2>
          <h2 class="thin">
            Pockets are any-purpose group spaces where your imagination is the only
            limit.
          </h2>
          <CloudinaryImg photo={pocket_hero[0]} square />
        </li>
        <li data-fill="system-superlight">
          <p class="h3">Step 2:</p>
          <h2 class="h1">Post anything.</h2>
          <h2 class="thin">
            Supports links, pics, and "add more" for whatever you're sharing.
          </h2>
          <CloudinaryImg photo={pocket_hero[0]} square />
        </li>
        <li data-fill="system-superlight">
          <p class="h3">Step 3:</p>
          <h2 class="h1">Reward good content.</h2>
          <h2 class="thin">
            Our like button earns you a cent, as a "thank you" for sharing great
            content.
          </h2>
          <CloudinaryImg photo={pocket_hero[0]} square />
        </li>
      </ul>
    </div>
    <div class="card">
      <h2 class="h1">
        <a href="/worldfeed" data-unstyle
          ><Icon icon="public" inline /><u>Worldfeed</u></a
        > is the best of your town.
      </h2>
      <p class="h2 thin">
        Subscribers can add pockets and posts to their city's Worldfeed, so there's
        one place for everything happening.
      </p>
    </div>
    <Container>
      <Container fill="system-superlight" rounded>
        <h2 class="h1">Your privacy is not for sale on Pocketrides.</h2>
        <p class="h2 thin">
          Our mission is to create a non-addictive, safe community space for all ages
          — with no ads. <a
            href="#why"
            class="strong"
            on:click|preventDefault={whyClick}>Read why this matters.</a
          >
        </p>
      </Container>
      <Container rounded fill="system-dark">
        <h2 class="h1">Free for everyone. $5/mo for Unlimited.</h2>
        <h3 class="h2 thin">
          Useful from day one: make your first pocket for free, invite all your
          friends for free, and join up to three pockets completely for free. Then
          Unlimited is just $5/mo.
        </h3>
      </Container>
      <p>
        You <strong>do not need</strong> an active subscription to use Pocketrides or
        get paid for likes on your posts.
      </p>
    </Container>
    <div class="card">
      <h2 class="h1 jumbo" data-h>Planning for the future, together.</h2>
      <p class="h1 thin">
        Our profits are yours to keep — but we'd love if you donated your portion to
        climate action. <a href="/pocket/362022120043053129" class="strong"
          >Read the plan.</a
        >
      </p>
    </div>
    <div class="card">
      <Container rounded fill="system-superlight">
        <h2 class="h1">We're just getting started.</h2>
        <p class="h2 thin">
          Early adopters, we're here to support you: join
          <a href="/pocket/362021519145041997" class="strong"
            ><Icon icon="hail" inline />Feature Requests</a
          >
          to tell us what sucks or ask questions if you get stuck.
        </p>
      </Container>
    </div>
  </Container>

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

<Sheet id="why_pocketrides" header="Why Pocketrides?" close="Done">
  <div data-flex="v" data-gap="1">
    <Container rounded fill="system-superlight">
      <div data-flex="v" data-gap>
        <h2>
          <a
            href="https://www.youtube.com/live/WXmtd-Lf4Do?feature=share&t=250"
            target="_blank"
            rel="noreferrer">According to the CDC,</a
          >
          young Americans are experiencing a mental health crisis.
        </h2>
      </div>
    </Container>
    <div data-flex="v" data-gap>
      <h2>
        Truly alarming statistics. But what can a social network do to tackle the
        root cause?
      </h2>
      <h3>
        Pocketrides has three core features that work together for a positive mental
        health outcome:
      </h3>
      <ol class="h3">
        <li>No algorithmic content.</li>
        <li>The Quarantine button.</li>
        <li>An ethical business model.</li>
      </ol>
      <h2 data-ph>No algorithmic content</h2>
      <p>
        Pocketrides has no algorithmic recommended content, no "suggested posts," and
        no doom-scrolling. We purposefully keep your home feed in chronological order
        — and it has an ending. When you reach the bottom, you're done for the day.
      </p>
      <p>
        We believe this will help your mental health in the long run, because the
        apps we use all day are tiny dopamine machines, and <a
          href="https://www.teenvogue.com/story/the-science-behind-social-medias-hold-on-our-mental-health"
          target="_blank"
          class="h3"
          rel="noreferrer"
          >a dopamine deficit is attributed to depression and addiction</a
        >.
      </p>
      <h2 data-ph>The Quarantine button</h2>
      <p>
        At Pocketrides, one of our core beliefs is that you should be in control of
        what you see online. We built the <Button
          inline
          icon="support"
          label="Quarantine"
        /> button so that when you see something that's not for you, it's easy to hide.
      </p>
      <p>
        The Quarantine button has a double purpose: you don't see that particular
        content anymore, and the author gets the feedback that their audience doesn't
        like what they posted.
      </p>
      <h2 data-ph>An ethical business model</h2>
      <p>
        The economics of modern social networks aren't that hard to understand: you
        see an ad, the platform makes money. Everyone gets a free place to
        communicate and share their creativity, and platforms can pay the bills.
        Why's that so bad?
      </p>
      <p>
        In its most recent quarter, it was estimated that Facebook now makes <a
          href="https://twitter.com/tanayj/status/1651334563401027584"
          target="_blank"
          class="h3"
          rel="noreferrer">over $200 a year</a
        >
        from our eyeballs. In the relentless quest for
        <a
          href="https://en.wikipedia.org/wiki/Shareholder_primacy"
          target="_blank"
          class="h3"
          rel="noreferrer">shareholder profits,</a
        >
        showing you more ads directly equals more profit. And the more targeted an ad
        can be, the more these platforms earn — even if it means selling your most private
        moments
        <a
          href="https://revealnews.org/article/facebook-data-abortion-crisis-pregnancy-center/"
          target="_blank"
          class="h3"
          rel="noreferrer">like a trip to an abortion clinic</a
        >.
      </p>
      <p>
        Pocketrides has a business model that intentionally <strong
          >does not make money</strong
        > from your eyeballs. For people who want to subscribe, it's $5/mo. If not, pockets
        are free to join so your friends never miss out.
      </p>
      <p>
        Bottom line: surveillance capitalism has no place on Pocketrides, period. We
        make a product that has a host of great features, and will always be 100%
        subscriber-funded. We are 100% employee-owned and bootstrapped, <a
          href="https://kinsta.com/blog/vc-route/"
          target="_blank"
          class="h3"
          rel="noreferrer">not VC-funded.</a
        >
      </p>
    </div>
    <div>
      <Button
        label="Done"
        on:click={() => {
          $App.sheet_id = '';
        }}
      />
    </div>
  </div>
</Sheet>

<style lang="scss">
  [data-h] {
    padding-top: 3rem;
    margin-bottom: 1rem;
  }

  .card {
    padding: 1rem;

    .jumbo {
      font-size: 2.5rem;
      line-height: 1.25;
    }

    h1,
    h2 {
      span:not([data-nobreak]) {
        display: block;
      }
    }

    :global(img) {
      max-width: 100%;
    }
  }

  .how-it-works {
    margin-top: 3rem;
    margin-bottom: 1rem;
    padding: 3rem 0 1rem;

    @media (min-width: 640px) {
      border-radius: 1.5rem;
    }

    > h2 {
      margin: 0 1rem 1rem;
    }
  }

  [data-flex='scroll-h'] {
    gap: 0;
    padding: 0 1rem;

    li {
      margin: 0 1rem 0 0;
      padding: 1rem;
      display: flex;
      border-radius: 1rem;
      width: 75vw;
      max-width: 540px;
      flex-shrink: 0;
      height: 480px;

      flex-direction: column;

      &:last-child {
        margin-right: 0;
      }

      :global(img) {
        margin-top: auto;
        max-width: 100%;
      }
    }
  }
</style>
