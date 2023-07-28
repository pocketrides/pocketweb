<script lang="ts">
  import Button from '$lib/components/Button.svelte';
  import Container from '$lib/components/Container.svelte';
  import Logo from '$lib/components/Logo.svelte';
  import Main from '$lib/components/Main.svelte';
  import SiteHeader from '$lib/components/SiteHeader.svelte';
  import PocketLoader from '$lib/components/pockets/PocketLoader.svelte';
  import AppHelp from '$lib/sheets/AppHelp.svelte';
  import HowPricingWorks from '$lib/sheets/HowPricingWorks.svelte';
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
      name: 'Photography',
      pocket_ids: [
        '369378891297456201',
        '368104234375184461',
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
      name: 'Events',
      pocket_ids: ['368450406291865673', '366283412006240329']
    },
    {
      name: 'Travel',
      pocket_ids: ['369175255525097545', '367977248179880004', '369525939762102345']
    },
    {
      name: 'Local interests',
      pocket_ids: [
        '367889934459076681',
        '366216518357221449',
        '367896365238321225',
        '365101532914384969'
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
    <span>Pocketrides<em>!</em></span>
  </h1>
</SiteHeader>
<Main padded={false}>
  <div class="root" data-flex="v">
    <Container fill="dark" rounded_lg>
      <div class="card" data-flex="v jc" data-ga>
        <h2>
          <span class="half">Life's a <em>wild</em> ride.</span><br />
          <span class="jumbo">Keep up on Pocketrides<em>!</em></span>
        </h2>
      </div>
    </Container>

    <Container fill="dark" theme="sky" rounded_lg>
      <div data-flex="v as" data-gap="1">
        <div data-flex="v as" data-gap>
          <h3>
            Let your creativity thrive. <span class="half"
              >Get out of the algorithm and post about whatever you love.</span
            > It's called a Pocket:
          </h3>
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

    <Container fill="dark" theme="teal" rounded_lg>
      <div data-flex="v as" data-gap="1">
        <div data-flex="v as" data-gap>
          <h3>
            Shared experiences have a new home. <span class="half"
              >Whether it's with your friends, your city, or the world,</span
            > it all happens on Worldfeed:
          </h3>
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

    <Container fill="dark" theme="lilac" rounded_lg>
      <div data-flex="v cc" data-gap="1">
        <div data-flex="v as" data-gap>
          <h3>
            <span class="half">Share the love:</span><br />
            <span class="h1">Every like pays a penny.</span>
          </h3>
          <p class="half small">
            It's a new way to take care of each other just by being creative on the
            internet. Start a Payout in Settings when you have 500 likes. That's $5!
          </p>
        </div>
      </div>
    </Container>

    <Container fill="light" rounded_lg>
      <div data-flex="v jc" data-gap>
        <h3>
          <span class="half">Start with Free Mode.</span><br />
          <span class="h1">Upgrade to Unlimited.</span>
        </h3>
        <div>
          <Button
            label="How pricing works"
            on:click={() => {
              $App.sheet_id = 'how_pricing_works';
            }}
          />
        </div>

        <div data-ph>
          <PocketLoader pocket_id="364647123794264137" />
        </div>
      </div>
    </Container>

    <Container fill="superlight" theme="teal" rounded_lg>
      <div data-flex="v jc" data-gap>
        <h3>
          <span class="half">Our objective:</span><br />
          <span class="h1">Fund climate action.</span>
        </h3>
        <p>
          <strong>It's the hottest summer on record.</strong>
          <small class="half"
            >Let's do something about it, together. Unlike other social networks, the
            bigger we get the more good we can do for the planet. Here's our plan:</small
          >
        </p>
        <div data-ph>
          <PocketLoader pocket_id="362022120043053129" />
        </div>
      </div>
    </Container>

    <Container fill="superlight" rounded_lg>
      <div data-flex="v jc" data-gap>
        <p>
          <strong
            >It's time for a privacy-focused, subscriber-owned social network.</strong
          >
          <small class="half"
            >We're building a community of people that care about the future of
            social media, online privacy, and the planet. If that's you, join Feature
            Requests:</small
          >
        </p>
        <div data-ph>
          <PocketLoader pocket_id="362021519145041997" />
        </div>
      </div>
    </Container>

    <div>
      <h3 data-padded>
        <span class="half">Bet you have some questions.</span><br />
        <span class="h1">Everything you need to know:</span>
      </h3>
      <WhyPocketridesContent include_header={false} />
    </div>
  </div>
</Main>

<AppHelp />
<WhyPocketrides />
<HowPricingWorks />

<style lang="scss">
  @media (min-width: 640px) {
    .root {
      gap: 1rem;
    }
  }

  .card {
    min-height: 210px;
  }
</style>
