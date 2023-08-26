<script lang="ts">
  import Button from '$lib/components/Button.svelte';
  import Container from '$lib/components/Container.svelte';
  import Icon from '$lib/components/Icon.svelte';
  import Logo from '$lib/components/Logo.svelte';
  import Main from '$lib/components/Main.svelte';
  import SiteHeader from '$lib/components/SiteHeader.svelte';
  import PocketLoader from '$lib/components/pockets/PocketLoader.svelte';
  import AppHelp from '$lib/sheets/AppHelp.svelte';
  import WhyPocketrides from '$lib/sheets/WhyPocketrides.svelte';
  import WhyPocketridesContent from '$lib/sheets/WhyPocketrides/WhyPocketridesContent.svelte';
  import { App } from '$lib/stores/app';
  import { writable } from 'svelte/store';

  $: $App.theme = 'system';

  let pocket_sections = [
    {
      name: 'Hobbies',
      pocket_ids: [
        '369414847542067273',
        '369391395621830733',
        // '369427302783647821',
        // '369393651301744708',
        '369562676868677713',
        '361936679469056077'
      ]
    },
    {
      name: 'Communities',
      pocket_ids: [
        '369378891297456201',
        '367889934459076681',
        '369558784210632781',
        '369377356035391568'
      ]
    },
    {
      name: 'Interests',
      pocket_ids: [
        '369439582385602637',
        '369389938101190737',
        '369392094951768145',
        '363183814563856464'
        // '369414847542067273',
        // '370717406573625421',
        // '369382950179962960',
        // '369388612862607433'
      ]
    }
  ];

  let worldfeed_sections = [
    {
      name: `Your city's best…`,
      pocket_ids: [
        '368104234375184461',
        '366216518357221449',
        '367896365238321225',
        '365101532914384969'
      ]
    },
    {
      name: 'Community events',
      pocket_ids: ['368450406291865673', '366283412006240329']
    },
    {
      name: 'Places you love',
      pocket_ids: [
        '369175255525097545',
        '367977248179880004',
        '369525939762102345',
        '371616288904052813'
      ]
    }
  ];

  const selected_pocket_section = writable(pocket_sections[0]);
  const selected_worldfeed_section = writable(worldfeed_sections[0]);
</script>

<svelte:head>
  <title
    >life's a wild ride, keep up on pocketrides! A community for everyone and hope
    for a green future.</title
  >
  <meta
    name="description"
    content="Be amazed by what $1.99/mo can do for your digital mental health, your communities — and your planet."
  />
</svelte:head>

<SiteHeader huddable>
  <h1 slot="left" data-flex="cc" data-gap>
    <Logo />
    <span>Pocketrides!</span>
  </h1>
</SiteHeader>
<Main padded={false}>
  <div class="root" data-flex="v">
    <Container fill="dark" rounded_lg>
      <div class="card" data-flex="v jc" data-gap="1">
        <!-- <p class="h2">
          We're a better social network.
          <span class="half">Because you'll have a better conversation here.</span>
        </p> -->
        <p class="h2" data-ph>
          The future's gonna be a <em>wild</em> ride.<br />
          <span class="half">Keep up on Pocketrides!</span>
        </p>
        <p class="h2" data-ph>
          <span class="half"
            >A digital town square raising a billion dollars for climate action.</span
          >
        </p>
      </div>
    </Container>
    <Container fill="dark" theme="teal" rounded_lg>
      <div class="card demo" data-flex="v as" data-gap="1">
        <div data-flex="v as" data-gap>
          <h3 class="h2">Share the moment on Worldfeed.</h3>
          <p class="half">
            A home feed for your home town and the whole world. It's called
            Worldfeed:
          </p>
          <Button label={$selected_worldfeed_section.name} icon="unfold_more">
            <select
              data-sham
              on:change={(e) => {
                $selected_worldfeed_section =
                  worldfeed_sections[e.currentTarget.selectedIndex];
              }}
            >
              {#each worldfeed_sections as section}
                <option
                  value={section.name}
                  selected={$selected_worldfeed_section.name === section.name}
                  >{section.name}</option
                >
              {/each}
            </select>
          </Button>
        </div>
        <div data-flex="w" data-gap>
          {#each $selected_worldfeed_section.pocket_ids as pocket_id (pocket_id)}
            <PocketLoader {pocket_id} />
          {/each}
        </div>
      </div>
    </Container>
    <Container fill="dark" theme="sky" rounded_lg>
      <div class="card demo" data-flex="v as" data-gap="1">
        <div data-flex="v as" data-gap>
          <h3 class="h2">Unlimited imagination in a Pocket.</h3>
          <p class="half">
            Let your creativity thrive in your own social space, to use for whatever
            you get up to:
          </p>
          <Button label={$selected_pocket_section.name} icon="unfold_more">
            <select
              data-sham
              on:change={(e) => {
                $selected_pocket_section =
                  pocket_sections[e.currentTarget.selectedIndex];
              }}
            >
              {#each pocket_sections as section}
                <option
                  value={section.name}
                  selected={$selected_pocket_section.name === section.name}
                  >{section.name}</option
                >
              {/each}
            </select>
          </Button>
        </div>
        <div data-flex="w" data-gap>
          {#each $selected_pocket_section.pocket_ids as pocket_id (pocket_id)}
            <PocketLoader {pocket_id} />
          {/each}
        </div>
      </div>
    </Container>
    <Container fill="dark" theme="lilac" rounded_lg>
      <div class="card" data-flex="v cc" data-gap="1">
        <div data-flex="v as" data-gap>
          <h3 class="h2">Appreciate creativity in a new way.</h3>
          <p data-ph>
            <strong>Likes pay a penny each.</strong>
            <small class="half">
              Start a Payout in Settings when you have 500 likes. That's $5!
            </small>
          </p>
        </div>
      </div>
    </Container>
    <Container fill="superlight" theme="teal" rounded_lg>
      <div class="card" data-flex="v jc">
        <h3 class="h2">#ClimateActionNow</h3>
        <p>
          We have so many innovative ways of solving climate change together, so 100%
          of our profits are used for the cause:
        </p>

        <div data-ph>
          <PocketLoader pocket_id="362022120043053129" />
        </div>
      </div>
    </Container>
    <Container fill="light" rounded_lg>
      <div class="card" data-flex="v jc">
        <h3 class="h2">
          A place for people.
          <span class="half">Not spammers, trolls, or corporate advertisers.</span>
        </h3>
        <p>
          We're here to be a platform for having a great conversation, keeping up
          with your friends, and connecting to where you live.
        </p>
        <div data-ph>
          <Button
            label="How pricing works"
            icon="quiz"
            on:click={() => {
              $App.sheet_id = 'how_pricing_works';
            }}
          />
        </div>
        <div data-ph="lg">
          <PocketLoader pocket_id="364647123794264137" />
        </div>
      </div>
    </Container>
    <div>
      <h3 data-padded data-ph="lg">
        <span class="half">Bet you have some questions.</span><br />
        <span class="h1">Everything you need to know:</span>
      </h3>
      <WhyPocketridesContent include_header={false} />
    </div>
    <!-- <Container fill="superlight" rounded_lg>
      <div class="card" data-flex="v jc" data-gap>
        <h3>Early Adopters! Right this way:</h3>
        <div data-ph>
          <PocketLoader pocket_id="362021519145041997" />
        </div>
      </div>
    </Container> -->
  </div>
</Main>

<AppHelp />
<WhyPocketrides />

<style lang="scss">
  @media (min-width: 640px) {
    .root {
      gap: 1rem;
    }
  }

  .card {
    min-height: 210px;
  }

  // .hero {
  //   min-height: 420px;
  // }
</style>
