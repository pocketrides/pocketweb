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
                  Life's a ride, keep up
                </span>
                <span
                  class="jumbo"
                  in:fly|local={{ y: 50, duration: 550, delay: 75 }}
                >
                  on Pocketrides<em>!</em>
                </span>
              {/if}
            </h1>
          </div>
        </div>
      </Container>
    </Container>
    <Container>
      <div data-flex="v" data-gap>
        <h2 class="h1">
          A social network that protects your mental health, <span class="half"
            >supports your community, <span class="half"
              >and funds a green future.</span
            ></span
          >
        </h2>
        <h2 data-ph>
          Scroll down to see how it works <Icon icon="arrow_downward" inline /><br />
          <span class="half"> …or read why</span>
          <a href="#why" on:click|preventDefault={whyClick}>
            now is the right time to join a new place online.</a
          >
        </h2>
      </div>
    </Container>
    <Container padded={false} fill="system-superlight">
      <Gallery contain square={false} photos={pocket_hero} />
    </Container>
    <Container>
      <div data-flex="v" data-gap>
        <h2>
          Start with a Pocket. <span class="half"
            >A place for you and your friends to do, plan, and share anything.</span
          >
        </h2>
        <p>
          Details live at the top, there’s a feed for everyone to share photos and
          posts, and a group chat to hang out. Great for groups of any size, and free
          for everyone to join.
        </p>
      </div>
    </Container>
    <Container padded={false} fill="system-superlight">
      <Gallery contain square={false} photos={worldfeed_hero} />
    </Container>
    <Container>
      <div data-flex="v" data-gap>
        <h2>
          List it on Worldfeed.
          <span class="half">
            The <a href="/worldfeed">Worldfeed</a> is your digital town square, inspired
            by small town vibes.
          </span>
        </h2>
        <p>
          It helps you find stuff to do, join interesting groups, or just see what’s
          going on.
        </p>
      </div>
    </Container>
    <Container padded={false} fill="system-superlight">
      <Gallery contain square={false} photos={payouts_hero} />
    </Container>
    <Container>
      <div data-flex="v as" data-gap>
        <h2>
          Support your community.
          <span class="half">
            Creators do all the work on social media, so everyone earns like a
            creator.
          </span>
        </h2>
        <p>
          Our transparent creator program earns everyone a cent per like on their
          posts, and you can start a payout when you have at least 500 likes — that’s
          $5!
        </p>
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
        <div data-flex="v" data-gap>
          <h2>A sustainable, ethical business model.</h2>
          <h3>
            Make one Pocket for free and join up to three, then Unlimited is $5/mo.
          </h3>
          <p>
            Cancel anytime, you don't need an ongoing subscription to use Pocketrides
            or get paid for likes on your posts.
          </p>
        </div>
      </Container>
      <Container rounded fill="superdark">
        <h2>Profit sharing, coming soon.</h2>
        <h3>
          <a href="/pocket/364647123794264137">Stay tuned</a> for our plans to usher in
          a new generation of business — and help fund a green future.
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
