<script lang="ts">
  import { page } from '$app/stores';
  import Button from '$lib/components/Button.svelte';
  import CloudinaryImg from '$lib/components/CloudinaryImg.svelte';
  import Container from '$lib/components/Container.svelte';
  import Icon from '$lib/components/Icon.svelte';
  import Logo from '$lib/components/Logo.svelte';
  import Main from '$lib/components/Main.svelte';
  import Sheet from '$lib/components/Sheet.svelte';
  import SiteHeader from '$lib/components/SiteHeader.svelte';
  import UtilityNav from '$lib/components/UtilityNav.svelte';
  import WorldfeedNav from '$lib/components/worldfeed/WorldfeedNav.svelte';
  import Subscription from '$lib/forms/subscription/Subscription.svelte';
  import WhyPocketrides from '$lib/sheets/WhyPocketrides.svelte';
  import WhyPocketridesContent from '$lib/sheets/WhyPocketrides/WhyPocketridesContent.svelte';
  import { App } from '$lib/stores/app';
  import { Photos } from '$lib/stores/gallery';
  import type { CloudinaryPhoto } from '$lib/zod/CloudinaryPhoto';
  import { trackGoal } from 'fathom-client';
  import { onMount } from 'svelte';

  $: $App.theme = 'system';
  // $: $App.fill = 'system-light';

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
  <title
    >life's a ride, keep up on pocketrides! A community for everyone and hope for a
    green future.</title
  >
  <meta
    name="description"
    content="Be amazed by what $1.99/mo can do for your mental health, your community, and your planet."
  />
</svelte:head>

<SiteHeader huddable />
<Main fullheight padded={false}>
  <Container padded={false}>
    <div class="card" data-specialpad="">
      <div class="hero-inner" data-flex="ac" data-gap>
        <Logo />
        <h1 data-fill="">
          Pocketrides<em>!</em>
        </h1>
      </div>
      <h2 class="h1">
        An ad-free community space paying you a penny per like.
        <span class="half" data-nobreak>100% of profits to climate.</span>
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
      <h3 class="h2">
        Read how it works. <span data-nobreak="" class="half">Scroll down.</span>
      </h3>
    </div>
    <div class="how-it-works primary" data-fill="superdark">
      <Container padded>
        <div data-flex="v" data-gap>
          <p class="h1 jumbo">Our focus is you:</p>
          <h2 class="h1" data-ph>Your mental health.</h2>
          <p class="h3 half">
            How you consume content online affects your mood. No doomscrolling here!
          </p>
          <p class="h1" data-ph>Your community.</p>
          <p class="h3 half">
            Every like is worth a penny: it's an easy new way to support the people
            you love.
          </p>
          <p class="h1" data-ph>Your planet.</p>
          <p class="h3 half">
            100% of profits are for climate change, to solve the climate crisis
            together.
          </p>
        </div>
      </Container>
    </div>

    <div class="how-it-works" data-fill="dark" data-theme="lilac">
      <h2 class="h1 jumbo">Here's how it works:</h2>
      <ul data-flex="v" data-unstyle data-gap data-how>
        <li data-fill="system-superlight">
          <h2 class="h1">Make a Pocket.</h2>
          <h2 class="h3 half">
            From fandoms to road trips to farmers markets. Pockets are do-anything
            spaces for anything, and completely free to join.
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
          <h2 class="h1">Invite your friends.</h2>
          <h2 class="h3 half">
            Everyone can join your Pocket and talk about whatever. It's your own
            corner of the Internet!
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
          <h2 class="h1">Post on the Worldfeed.</h2>
          <h2 class="h3 half">
            Now, instead of going viral across the entire Internet, you're just
            competing in your town — who has the best tips? Who's got the best pics?
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
    <div data-theme="sky" class="card coming-soon">
      <Container fill="superlight" rounded_group rounded>
        <p class="h2 half">Coming Soon:</p>
        <p class="h1">Explore by asking.</p>
      </Container>
      <Container fill="dark" rounded_group rounded>
        <p class="h3 thin">
          Explore the world like a local just by asking, "what's going on this
          weekend?"
        </p>
      </Container>
    </div>
    <div data-theme="teal" class="about">
      <div class="card" data-fill="dark">
        <p class="h2 half" data-ph>Our mission:</p>
        <p class="h1">Be a better tech company.</p>
        <!-- <p class="h2 half">
          While operating a transparent, ethical, and empathetic tech company.
        </p> -->
        <p class="h2 half" data-ph>
          <a href="/pocket/364647123794264137"
            ><Icon icon="hail" inline />Transparency</a
          >
        </p>

        <!-- <p class="h2 half" data-ph> -->
        <!-- Our mission is to build a non-addictive platform where everyone has a
          community to support them. -->
        <!-- <a href="#why" on:click|preventDefault={whyClick}>Read why.</a> -->
        <!-- </p> -->
      </div>
      <div class="card" data-fill="superlight">
        <p class="h2 half" data-ph>Our objective:</p>
        <p class="h1 jumbo">Fund climate action.</p>
        <p class="h2 half" data-ph>
          Follow <a href="/pocket/362022120043053129"
            ><Icon icon="hail" inline />Pocketchange</a
          >
        </p>
      </div>

      <div class="card" data-fill="system-superlight">
        <h2 class="h1">
          <span class="half">Sustainably priced:</span>
          <span>Unlimited is $1.99/mo.</span>
        </h2>
        <p class="h3 thin" data-ph>
          <strong>Your privacy is never for sale.</strong> Pocketrides is 100% subscriber-funded.
          No subscription required, you'll never lose access to what you create.
        </p>
        <p class="h2 half" data-ph>
          <a href="/pocket/364647123794264137"
            ><Icon icon="hail" inline />Transparency</a
          >
        </p>
        <!-- <p>
        Get Unlimited just when you need it, or take the plunge and make Pocketrides
        your new place online period. Whatever you choose, now you have an
        alternative to other social networks that are designed for addiction.
      </p> -->
      </div>
    </div>
    <Container padded={false}>
      <h2 class="h1 half" data-padded data-ph>Questions, answered.</h2>
      <WhyPocketridesContent include_header={false} />
    </Container>
    <Container fill="system-superlight">
      <div class="card" data-specialpad>
        <h2 class="h1">Calling all early adopters.</h2>
        <p class="h3 thin" data-ph>
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
        <p class="h3 thin" data-ph>
          We have a great set of features planned for our first year, like a fresh
          take on stories and native apps to share pics <em>and</em> vids.
        </p>
        <p class="h2 half" data-ph>
          <a href="/help">About Pocketrides</a>
        </p>
      </div>
    </Container>
  </Container>

  <!-- <UtilityNav slot="utility-nav">
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
  </UtilityNav> -->
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

  .how-it-works {
    padding: 2rem 0;

    &:has(ul) {
      padding-bottom: 0;
    }

    &.primary {
      max-width: 420px;
      margin: auto;

      [data-flex] {
        padding: 0 1rem;
      }
    }

    @media (min-width: 640px) {
      border-radius: 1.5rem;
      padding: 1rem 0;
    }

    > h2 {
      margin: 0 1rem 1rem;
    }

    @media (min-width: 640px) {
      & + .how-it-works {
        margin-top: 2rem;
      }
    }
  }

  .coming-soon {
    max-width: 420px;
    margin: auto;
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

  .how-it-works [data-how] {
    gap: 0;
    padding: 0 1rem;

    li {
      margin: 0 0 1rem 0;
      padding: 1rem;
      display: flex;
      border-radius: 1rem;
      // max-width: 540px;
      flex-shrink: 0;
      // height: 480px;

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
