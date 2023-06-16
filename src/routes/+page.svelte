<script lang="ts">
  import { page } from '$app/stores';
  import Button from '$lib/components/Button.svelte';
  import CloudinaryImg from '$lib/components/CloudinaryImg.svelte';
  import Container from '$lib/components/Container.svelte';
  import Icon from '$lib/components/Icon.svelte';
  import Main from '$lib/components/Main.svelte';
  import Sheet from '$lib/components/Sheet.svelte';
  import SiteHeader from '$lib/components/SiteHeader.svelte';
  import UtilityNav from '$lib/components/UtilityNav.svelte';
  import WorldfeedNav from '$lib/components/worldfeed/WorldfeedNav.svelte';
  import Subscription from '$lib/forms/subscription/Subscription.svelte';
  import WhyPocketrides from '$lib/sheets/WhyPocketrides.svelte';
  import { App } from '$lib/stores/app';
  import { Photos } from '$lib/stores/gallery';
  import type { CloudinaryPhoto } from '$lib/zod/CloudinaryPhoto';
  import { trackGoal } from 'fathom-client';
  import { onMount } from 'svelte';

  $: $App.theme = 'system';
  $: $App.fill = 'system-light';

  $: ready = false;

  onMount(() => {
    ready = true;
  });

  const whyClick = () => {
    $App.sheet_id = 'why_pocketrides';
    trackGoal('JGGYLBWK', 1);
  };

  const hero: CloudinaryPhoto = {
    version: 1685394568,
    public_id: 'Homepage/v2/v2-hero_emwabh.png'
  };

  const step1: CloudinaryPhoto = {
    version: 1685393733,
    public_id: 'Homepage/v2/v2-step1_ulwbnu.png'
  };

  const step2: CloudinaryPhoto = {
    version: 1685393733,
    public_id: 'Homepage/v2/v2-step2_orimia.png'
  };
  const step3: CloudinaryPhoto = {
    version: 1685393733,
    public_id: 'Homepage/v2/v2-step3_k7fllz.png'
  };
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
<Main fullheight padded={false} fill="system-light">
  <Container padded={false}>
    <div class="card">
      <h1 class="jumbo" data-h>
        Build community like a local <span class="half"
          >on Pocketrides<em>!</em></span
        >
      </h1>
      <h2 class="h1 thin">
        The only platform designed with supporting your community in mind. <span
          class="half"
          data-nobreak>Life's a ride, keep up!</span
        >
      </h2>
      <CloudinaryImg
        photo={hero}
        square
        on:mouseup={() => {
          $Photos = {
            photos: [hero],
            selected: hero
          };
        }}
      />
    </div>
    <div class="card">
      <h2 class="h1">A home for everything.</h2>
      <p class="h2 thin">
        Keep your friends, groups, events and hobbies in one place, on Pocketrides.
      </p>
      <!-- <p>
        Host a group ride every week? Planning a regional craft fair? Or do you just
        happen to know everything cool going on? Whatever you do, it all fits on
        Pocketrides.
      </p> -->
    </div>
    <div class="card">
      <p class="h1">Let your creativity thrive.</p>
      <p class="h2 thin">
        Your great photos, compelling stories, or local knowledge has a new way to
        support you, on Pocketrides.
      </p>
      <!-- <p>
        Everyone has the same incentive on Pocketrides: to post great content and
        earn a cent per like for your contribution. Stories are the underpinnings of
        a great society, so we made a way to share a better story and make some cash
        in the process.
      </p> -->
    </div>

    <div class="how-it-works" data-fill="dark" data-theme="lilac">
      <h2 class="h1 jumbo">Here's how:</h2>
      <ul data-flex="scroll-h" data-unstyle data-gap>
        <li data-fill="system-superlight">
          <p class="h3 half">Step 1:</p>
          <h2 class="h1">Start with a pocket.</h2>
          <h2 class="thin">
            Pockets are any-purpose group spaces where your imagination is the only
            limit.
          </h2>
          <CloudinaryImg
            photo={step1}
            square
            on:mouseup={() => {
              $Photos = {
                photos: [step1],
                selected: step1
              };
            }}
          />
        </li>
        <li data-fill="system-superlight">
          <p class="h3 half">Step 2:</p>
          <h2 class="h1">Post anything.</h2>
          <h2 class="thin">
            Supports links, pics, and "adding more" — for whatever you're sharing.
          </h2>
          <CloudinaryImg
            photo={step2}
            square
            on:mouseup={() => {
              $Photos = {
                photos: [step2],
                selected: step2
              };
            }}
          />
        </li>
        <li data-fill="system-superlight">
          <p class="h3 half">Step 3:</p>
          <h2 class="h1">Like great content.</h2>
          <h2 class="thin">
            Our like button pays a cent per like, to support each other in a whole
            new way.
          </h2>
          <CloudinaryImg
            photo={step3}
            square
            on:mouseup={() => {
              $Photos = {
                photos: [step3],
                selected: step3
              };
            }}
          />
        </li>
      </ul>
    </div>
    <div class="card">
      <h2 class="h1" data-h>
        The <a href="/worldfeed" data-unstyle
          ><Icon icon="public" inline /><u>Worldfeed</u></a
        > is your city's home feed.
      </h2>
      <p class="h2 thin">
        Subscribers can add pockets and posts to their city's Worldfeed. Now there's
        one place to check out everything happening where you live or where you're
        visiting. <span class="half">Eureka!</span>
      </p>
      <!-- <p>
        Easily browse by city and state. Everything's ordered by likes, no algorithms
        or sponsored posts on Pocketrides.
      </p> -->
    </div>
    <div data-theme="sky" class="card">
      <Container fill="superlight" rounded>
        <p class="h2 half">Coming Soon:</p>
        <p class="h1">Explore by asking.</p>
      </Container>
      <Container fill="dark" rounded>
        <p class="h2 thin">
          We're bringing an AI search companion to Worldfeed, to help you explore the
          world — or just your back yard.
        </p>
      </Container>
    </div>
    <div class="card">
      <p class="h1 half" data-h>Our Mission:</p>
      <p class="h1 jumbo">Build an ethical social network.</p>
      <p class="h2 thin">
        Being 100% subscriber-funded means we're incentivized to treat you like a
        customer — not a user.
      </p>
      <p>
        <a href="#why" class="h2 strong" on:click|preventDefault={whyClick}
          >Read why this matters.</a
        >
      </p>
    </div>
    <div data-theme="teal">
      <Container fill="superlight">
        <p class="h2 half" data-ph>Our Objective:</p>
        <p class="h1 jumbo">Fund climate action.</p>
      </Container>
      <Container fill="dark">
        <p class="h2 thin">
          We've come up with a clever way to raise a billion dollars a year for
          climate action: use 100% of our profits.
        </p>
        <p class="h2 strong">
          Follow <a href="/pocket/362022120043053129"
            ><Icon icon="hail" inline />Pocketchange</a
          >
        </p>
      </Container>
    </div>
    <div class="card">
      <h2 class="h1" data-h>Get started for free.</h2>
      <p class="h2 thin">
        Our business model is sustainable and ethical: we're funded entirely by
        subscribers. Free Mode is fair, and Unlimited is $5/mo. Cancel anytime,
        you'll never lose access.
      </p>
      <!-- <p>
        Get Unlimited just when you need it, or take the plunge and make Pocketrides
        your new place online period. Whatever you choose, now you have an
        alternative to other social networks that are designed for addiction.
      </p> -->
    </div>
    <div class="card">
      <Container rounded fill="system-superlight">
        <h2 class="h1">Help us, help you.</h2>
        <p class="h2 thin">
          Early adopters, we're here to support you. Join
          <a href="/pocket/362021519145041997" class="strong"
            ><Icon icon="hail" inline />Feature Requests</a
          >
          to tell us what sucks, ask questions if you get stuck, or watch us build in
          the open.
        </p>
      </Container>
    </div>
    <div class="card">
      <p class="h1">A lot more, coming soon.</p>
      <p class="h2 thin">
        We have a great set of features planned for the next year, like a fresh take
        on stories and a native mobile app to take photos <em>and</em> videos.
      </p>
      <a href="/help" class="h2">Read about Pocketrides.</a>
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

<WhyPocketrides />

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
    padding: 3rem 0 4rem;

    @media (min-width: 640px) {
      border-radius: 1.5rem;
      padding-bottom: 1rem;
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
