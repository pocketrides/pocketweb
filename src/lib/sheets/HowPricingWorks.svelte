<script lang="ts">
  import Container from '$lib/components/Container.svelte';
  import Help from '$lib/components/Help.svelte';
  import Icon from '$lib/components/Icon.svelte';
  import Nametag from '$lib/components/Nametag.svelte';
  import Radio from '$lib/components/Radio.svelte';
  import Row from '$lib/components/Row.svelte';
  import Sheet from '$lib/components/Sheet.svelte';
  import NametagAnim from '$lib/forms/nametag/NametagAnim.svelte';
  import { formatCents } from '$lib/util/currency';
  import type { ClientNametag } from '$lib/zod/Nametag';
  import {
    PB_FREE_MODE,
    PB_LIKE_PACKS,
    PB_UNLIMITED_MODE,
    pb_sum,
    type Pricebook,
    pb_sync,
    PB_TURBO
  } from '$lib/zod/Pricebook';

  let nametags: ClientNametag[] = [
    {
      id: '',
      nametag: 'Tabby 😊',
      theme: 'sky'
    },
    {
      id: '',
      nametag: 'Steph 😍',
      theme: 'gold'
    },
    {
      id: '',
      nametag: '😑 Andrew',
      theme: 'teal'
    },
    {
      id: '',
      nametag: 'mary 🫶',
      theme: 'pink'
    },
    {
      id: '',
      nametag: '🙂 michelle',
      theme: 'teal'
    },
    {
      id: '',
      nametag: 'Holger 🌲',
      theme: 'sky'
    },
    {
      id: '',
      nametag: '🤠 MG',
      theme: 'teal'
    },
    {
      id: '',
      nametag: 'Caleb 👑',
      theme: 'lilac'
    },
    {
      id: '',
      nametag: 'Drew 🍭',
      theme: 'gold'
    }
  ];

  let pricebook: Pricebook = {
    current_mode: 'free_mode',
    like_pack: 0,
    transaction_fee: 0,
    turbo: 0
  };

  $: pricebook = pb_sync(pricebook);
  $: price = pb_sum(pricebook);
</script>

<Sheet
  id="how_pricing_works"
  header="How pricing works"
  padded={false}
  nav_height={pricebook.transaction_fee ? 120 : 95}
>
  <div data-flex="v" data-gap="1">
    <Container>
      <div data-flex="v" data-gap>
        <h2 class="h1 jumbo">
          <span class="h2 half">Start with Free Mode.</span><br />
          Upgrade to Unlimited.
        </h2>
        <Container fill="superlight" rounded>
          <p class="h3 half">First thing's first:</p>
          <Help summary="Your privacy is never for sale.">
            <p>
              Pocketrides is 100% subscriber-funded. You <strong
                >do not need an active subscription.</strong
              > You never lose access to what you create if you unsubscribe later. You
              own your content: you are the only one to make money from what you post
              on Pocketrides. Yes, we're doing things very differently here.
            </p>
          </Help>
        </Container>
      </div>
    </Container>
    <Container>
      <div data-flex="v" data-gap>
        <h2>Flexible, transparent pricing.</h2>
        <p id="pricing-explained">Choose between Free Mode and Unlimited:</p>
        <div data-flex data-gap>
          <Radio
            bind:group={pricebook.current_mode}
            value={PB_FREE_MODE}
            label="Free Mode"
            labelled_by="pricing-explained"
          />
          <Radio
            bind:group={pricebook.current_mode}
            value={PB_UNLIMITED_MODE}
            label="Unlimited"
            labelled_by="pricing-explained"
            icon="favorite"
            icon_filled={pricebook.current_mode === PB_UNLIMITED_MODE}
          />
        </div>
        {#if pricebook.current_mode === PB_FREE_MODE}
          <p class="small" aria-live="assertive" data-minheight>
            Create one Pocket and join up to three.
          </p>
        {:else if pricebook.current_mode === PB_UNLIMITED_MODE}
          <ol data-unstyle class="small" aria-live="assertive" data-minheight>
            <li>
              <Icon icon="favorite" filled />
              Share the love with 50 likes/mo
            </li>
            <li>
              <Icon icon="hail" />
              Create unlimited Pockets
            </li>
            <li>
              <Icon icon="travel_explore" />
              Post to Worldfeed
            </li>
            <li>
              <Icon icon="chair" />
              Post to your home feed & close friends
            </li>
          </ol>
        {/if}
      </div>
    </Container>
    <div class:half={pricebook.current_mode === PB_FREE_MODE}>
      <fieldset disabled={pricebook.current_mode === PB_FREE_MODE} data-flex="v">
        <Container>
          <div data-flex="v" data-gap>
            <h2>
              <span class="h3 half">Coming Soon:</span><br />
              Turbocharge Pocketchange 🌱
            </h2>
            <p id="turbo">
              Help us reach our goal of raising a billion dollars for climate action
              even faster, and get a shoutout on your Nametag.
            </p>
            <div data-flex="w as" data-gap="1">
              {#each nametags as nt, index}
                <a
                  data-nametag
                  href="#inert"
                  on:click|preventDefault={() => {}}
                  data-theme={nt.theme}
                  data-3d
                  data-fill="base"
                  class="h3"
                >
                  {nt.nametag}
                  <span class="seedling">🌱</span>
                </a>
              {/each}
            </div>
            <div data-flex="w" data-gap>
              <Radio
                bind:group={pricebook.turbo}
                value={0}
                label="Nah"
                labelled_by="turbo"
              />
              <Radio
                bind:group={pricebook.turbo}
                value={PB_TURBO}
                label="Hell yeah"
                labelled_by="turbo"
              />
            </div>
            <small data-minheight
              >This is a $1/mo direct donation to <a
                href="/pocket/362022120043053129"
                class="strong">Pocketchange</a
              >.</small
            >
          </div>
        </Container>
      </fieldset>
    </div>
    <div class:half={pricebook.current_mode === PB_FREE_MODE}>
      <fieldset disabled={pricebook.current_mode === PB_FREE_MODE} data-flex="v">
        <Container>
          <div data-flex="v" data-gap>
            <h2>
              <span class="h3 half">Coming Soon:</span><br />
              Share even more of the love.
            </h2>
            <p id="likepacks">Buy more likes each month:</p>
            <div data-flex="w" data-gap>
              {#each PB_LIKE_PACKS as like_pack}
                <Radio
                  bind:group={pricebook.like_pack}
                  value={like_pack}
                  label={like_pack === 0 ? 'Nah' : like_pack.toString()}
                  labelled_by="likepacks"
                />
              {/each}
            </div>
            <small>We don't make money when you buy more likes.</small>
          </div>
        </Container>
      </fieldset>
    </div>
  </div>
  <div slot="nav" data-fill="system-superlight">
    <Container>
      <Row flex="ab sb">
        <h2 slot="left" class="half">
          Grand total:
          {#if pricebook.transaction_fee}
            <p class="h3 half">Subtotal:</p>
            <p class="h3 half">Transaction fee:</p>
          {/if}
        </h2>
        <p slot="right" class="h1 jumbo">
          {formatCents(price)}/mo
          {#if pricebook.transaction_fee}
            <div class="half">
              <p class="h3 half">
                {formatCents(price - pricebook.transaction_fee)}/mo
              </p>
              <p class="h3 half">
                {formatCents(pricebook.transaction_fee)}/mo
                {#if Math.round(pricebook.transaction_fee) === 69}
                  <small>😎 nice</small>
                {/if}
              </p>
            </div>
          {/if}
        </p>
      </Row>
    </Container>
  </div>
</Sheet>

<style lang="scss">
  [data-minheight] {
    min-height: 100px;
  }

  @media (min-width: 640px) {
    [data-minheight] {
      min-height: 0;
    }
  }
</style>
