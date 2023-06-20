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
    content="A non-addictive social network for authentic communities: No ads, no data sales, and no greedy profit motive."
  />
</svelte:head>

<SiteHeader huddable>
  <WorldfeedNav slot="nav" />
</SiteHeader>
<Main fullheight padded={false} fill="system-light">
  <Container padded={false}>
    <!-- <div class="card hero">
      <Container rounded fill="superlight">
        <div class="hero-inner">
          <Logo />
          <h1 data-fill="superlight">
            <span class=" half">Life's a ride, keep up on</span>
            <span class="jumbo">Pocketrides<em>!</em></span>
             <span class="jumbo">Shape the future.</span>
            <span class="">Empower creativity.</span>
            <span class="">Share local magic.</span>
            <h2 class="h2">It's all on Pocketrides<em>!</em></h2>
          </h1>
        </div>
      </Container>
    </div> -->
    <div class="card hero">
      <h1 class="jumbo">
        <span>Life's a ride, keep up</span>
        <span class="half">on Pocketrides<em>!</em></span>
      </h1>
    </div>
    <div class="card">
      <!-- <h2 class="h1">Anti Big Tech.</h2> -->
      <h2>
        <span>A non-addictive social network for authentic communities.</span>
        <span data-nobreak="" class="half">
          No ads, no data sales, and no greedy profit motive.
        </span>
      </h2>

      <!-- <h2 class="h1">It's all on Pocketrides<em>!</em></h2> -->
      <!-- <h2>
        <span data-nobreak="">A new kind of social network:</span>
        <span data-nobreak="" data-fill="superlight">
          support creativity with every like, build your own space online,
        </span>
        <span data-nobreak>and fund climate action.</span>
      </h2> -->
      <!-- <h2 class="h2">
        A home for everything: <span class="" data-nobreak data-fill="superlight">
          showcase your world while supporting your community.
        </span>
        <span class="" data-nobreak>Life's a ride, keep up</span>
        <span data-nobreak>on Pocketrides<em>!</em></span>
      </h2> -->
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
      <h2 class="h1">Ad-free, like it should be.</h2>
      <p class="h2 thin">
        We’re building a non-addictive space for our communities. <a
          href="#why"
          class="strong"
          on:click|preventDefault={whyClick}>Why?</a
        >
      </p>
      <!-- <p>
        Host a group ride every week? Planning a regional craft fair? Or do you just
        happen to know everything cool going on? Whatever you do, it all fits on
        Pocketrides.
      </p> -->
    </div>
    <div class="card">
      <p class="h1">Likes earn you a cent.</p>
      <p class="h2 thin">
        Your great photos, compelling stories, or local knowledge has a new way to
        support you: 500 likes is $5.
      </p>
      <!-- <p>
        Everyone has the same incentive on Pocketrides: to post great content and
        earn a cent per like for your contribution. Stories are the underpinnings of
        a great society, so we made a way to share a better story and make some cash
        in the process.
      </p> -->
    </div>
    <div class="card">
      <p class="h1">Profits for purpose.</p>
      <p class="h2 thin">
        100% of our profits are for climate action. We can all have meaningful impact
        with
        <a href="/pocket/362022120043053129" class="strong"
          ><Icon icon="hail" inline />Pocketchange</a
        >.
      </p>
      <p class="h2 half" data-ph>Read more:</p>
      <p class="h2">
        <a href="#why" on:click|preventDefault={whyClick}>Why Pocketrides?</a>
      </p>
    </div>

    <div class="how-it-works" data-fill="dark" data-theme="lilac">
      <h2 class="h1 jumbo">Here's how it works:</h2>
      <ul data-flex="scroll-h" data-unstyle data-gap>
        <li data-fill="system-superlight">
          <h2 class="h1">Do anything together, in a Pocket.</h2>
          <h2 class="h2 thin">
            A group space for events, hobbies, or anything else you can dream up.
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
          <h2 class="h1">Share everything in a Post.</h2>
          <h2 class="h2 thin">
            Write as much as you want. Add pics and links. Choose who sees it.
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
          <h2 class="h1">Likes earn everyone a cent each.</h2>
          <h2 class="h2 thin">
            It's a new way to support yourself and your community.
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
        <a href="/worldfeed" data-unstyle
          ><Icon icon="public" inline /><u>Worldfeed</u></a
        > is your city's new home feed.
      </h2>
      <p class="h2 thin">
        Now there's one place to check for everything happening where you live or
        where you're visiting. <span class="half">Eureka!</span>
      </p>
      <!-- <p>
        Easily browse by city and state. Everything's ordered by likes, no algorithms
        or sponsored posts on Pocketrides.
      </p> -->
    </div>
    <div data-theme="sky" class="card">
      <Container fill="base" rounded>
        <p class="h2 half">Coming Soon:</p>
        <p class="h1">Explore by asking.</p>
      </Container>
      <Container fill="dark" rounded>
        <p class="h2 thin">
          We're bringing an AI search companion to Worldfeed, to help you explore the
          world like a local.
        </p>
      </Container>
    </div>
    <div data-theme="teal" class="about">
      <div class="card" data-fill="dark">
        <p class="h2 half" data-ph>Our mission:</p>
        <p class="h1">
          Operate a transparent, ethical, and empathetic tech company.
        </p>
        <p class="h2 half">While creating equitable economic prosperity for all.</p>
        <p class="h2 half" data-ph>
          <a href="/pocket/364647123794264137"
            ><Icon icon="hail" inline />Transparency on Pocketrides</a
          >
        </p>

        <!-- <p class="h2 half" data-ph> -->
        <!-- Our mission is to build a non-addictive platform where everyone has a
          community to support them. -->
        <!-- <a href="#why" on:click|preventDefault={whyClick}>Read why.</a> -->
        <!-- </p> -->
      </div>
      <div class="card" data-fill="base">
        <p class="h2 half" data-ph>Our objective:</p>
        <p class="h1 jumbo">Fund climate action.</p>
        <p class="h2 half" data-ph>
          Follow <a href="/pocket/362022120043053129"
            ><Icon icon="hail" inline />Pocketchange</a
          >
        </p>
      </div>

      <div class="card" data-fill="system-light">
        <h2 class="h1">
          <span class="half">Free to try.</span>
          <span>Unlimited is $5/mo.</span>
        </h2>
        <p class="h2 thin">
          Sustainable pricing, split with creators. Your privacy is never for sale.
          Pause anytime, you'll never lose access.
        </p>
        <p class="h2 half" data-ph>
          <a href="/pocket/364647123794264137"
            ><Icon icon="hail" inline />Transparency on Pocketrides</a
          >
        </p>
        <!-- <p>
        Get Unlimited just when you need it, or take the plunge and make Pocketrides
        your new place online period. Whatever you choose, now you have an
        alternative to other social networks that are designed for addiction.
      </p> -->
      </div>
    </div>
    <Container fill="system-superlight">
      <div class="card" data-specialpad>
        <h2 class="h1">Calling all early adopters.</h2>
        <p class="h3 thin">
          We're here to support you! Tell us what sucks, ask questions if you get
          stuck, and help us build something amazing, together.
        </p>
        <p class="h2 half" data-ph>
          Join
          <a href="/pocket/362021519145041997" class="strong"
            ><Icon icon="hail" inline />Feature Requests</a
          >
        </p>
      </div>
    </Container>
    <Container>
      <div class="card" data-specialpad>
        <p class="h1">It'll be a busy first year.</p>
        <p class="h3 thin">
          We have a great set of features planned for our first year, like a fresh
          take on stories and native apps to share pics <em>and</em> vids.
        </p>
        <p class="h2 half" data-ph>
          <a href="/help">About Pocketrides</a>
        </p>
      </div>
    </Container>
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

    &[data-specialpad] {
      padding-top: 3rem;
      padding-bottom: 3rem;
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

  .hero {
    margin-top: 2rem;
  }

  .how-it-works {
    margin-top: 3rem;
    margin-bottom: 1rem;
    padding: 5rem 0 6rem;

    @media (min-width: 640px) {
      border-radius: 1.5rem;
      padding-bottom: 1rem;
    }

    > h2 {
      margin: 0 1rem 1rem;
    }
  }

  .about {
    margin: 4rem auto 0;
    // border-bottom: 1px solid rgba(var(--superdark), 0.25);

    @media (min-width: 640px) {
      margin-bottom: 4rem;
      overflow: hidden;
      border: 1px solid rgba(var(--superdark), 0.25);
      border-radius: 1rem;
    }

    .card {
      padding: 0 2rem;
      aspect-ratio: 1/1;
      display: flex;
      justify-content: center;
      flex-direction: column;
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
