<script lang="ts">
  import Button from '$lib/components/Button.svelte';
  import Container from '$lib/components/Container.svelte';
  import Help from '$lib/components/Help.svelte';
  import Icon from '$lib/components/Icon.svelte';
  import Radio from '$lib/components/Radio.svelte';
  import Sheet from '$lib/components/Sheet.svelte';
  import { App } from '$lib/stores/app';
  import { formatCents } from '$lib/util/currency';
  import { plural } from '$lib/util/plural';
  import type { ClientNametag } from '$lib/zod/Nametag';
  import {
    PB_FREE_MODE,
    PB_LIKE_PACKS,
    PB_UNLIMITED_MODE,
    pb_sum,
    type Pricebook,
    pb_sync,
    PB_TURBO,
    PB_SUGGESTED_MODE
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
      nametag: 'Holger 🌲',
      theme: 'sky'
    },
    {
      id: '',
      nametag: 'Cass 👑',
      theme: 'lilac'
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
        <Container fill="system-superlight" rounded>
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
          <Help summary="We operate like a nonprofit.">
            <p>
              We're here to be a platform to have a great conversation, help you keep
              up with your friends, and connect to where you live. We're a different
              kind of tech company: none of the employees or founders get personally
              rich from this. The future of ethical tech companies starts now.
            </p>
          </Help>
          <Help summary="Share the love.">
            <p>
              When you upgrade to Unlimited, $0.50 of your subscription goes into the
              like button. When you see great content on Pocketrides, give it a like:
              it transfers a penny to that person. It's more important than ever to
              support each other in small ways, even if it's just a penny at a time.
            </p>
          </Help>
        </Container>
      </div>
    </Container>
    <Container>
      <div data-flex="v" data-gap>
        <h2>Flexible, transparent pricing.</h2>
        <p id="pricing-explained">Choose between Free Mode and Unlimited:</p>
        <div data-flex="w" data-gap>
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
          <Button
            label="Suggested"
            icon="auto_fix_high"
            on:click={() => {
              pricebook = {
                current_mode: 'unlimited_mode',
                like_pack: 200,
                turbo: PB_TURBO,
                transaction_fee: 0
              };
            }}
          />
          <Button
            label="Start over"
            transparent
            on:click={() => {
              pricebook = {
                current_mode: 'free_mode',
                like_pack: 0,
                turbo: 0,
                transaction_fee: 0
              };
            }}
          />
        </div>
        <ol data-unstyle class="small" aria-live="assertive" data-minheight>
          <li>
            <Icon icon="favorite" />
            {(
              (pricebook.current_mode === 'free_mode' ? 0 : 50) + pricebook.like_pack
            ).toString()} likes/mo
          </li>
          {#if pricebook.current_mode !== 'free_mode'}
            <li>
              <Icon icon="travel_explore" />
              Post to Worldfeed
            </li>
          {/if}
          <li>
            <Icon icon="hail" />
            Create {plural(
              pricebook.current_mode === 'free_mode' ? 1 : 0,
              'one Pocket',
              'unlimited Pockets',
              false
            )}
          </li>
          <li>
            <Icon icon="chair" />
            Keep up with friends on your home feed
          </li>
          <li>
            <Icon icon="draw" />
            {#if pricebook.current_mode === 'free_mode'}
              Only post in Pockets (join up to 3 for free)
            {:else}
              Post to your home feed & close friends
            {/if}
          </li>
        </ol>

        <!-- <ol data-unstyle class="small" aria-live="assertive" data-minheight>
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
              <Icon icon="draw" />
              Post to your home feed & close friends
            </li>
          </ol> -->
      </div>
    </Container>
    <div class:half={pricebook.current_mode === PB_FREE_MODE}>
      <fieldset disabled={pricebook.current_mode === PB_FREE_MODE} data-flex="v">
        <Container>
          <div data-flex="v" data-gap>
            <h2>
              <span class="h3 cs" data-fill="system-base">Coming Soon</span><br />
              Turbocharge Pocketchange 🌱
            </h2>
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
            <p id="turbo">
              Help us reach our goal of raising a billion dollars for climate action
              even faster, and get a shoutout on your Nametag.
            </p>
            <div data-flex="w" data-gap>
              <Radio
                bind:group={pricebook.turbo}
                value={0}
                label="Nah"
                labelled_by="turbo"
                disabled={pricebook.current_mode === 'suggested_mode'}
              />
              <Radio
                bind:group={pricebook.turbo}
                value={PB_TURBO}
                label="Hell yeah"
                labelled_by="turbo"
              />
            </div>
            <small
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
              <span class="h3 cs" data-fill="system-base">Coming Soon</span><br />
              Share even more of the love.
            </h2>
            <p id="likepacks">Buy more likes each month:</p>
            <div data-flex="w" data-gap>
              {#each PB_LIKE_PACKS as like_pack}
                <Radio
                  bind:group={pricebook.like_pack}
                  disabled={pricebook.current_mode === 'suggested_mode' &&
                    like_pack !== 200}
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
      <div data-flex="v">
        <p data-flex="ab sb">
          <span class="h2 half">Subtotal:</span>
          <span class="h1 jumbo">
            {formatCents(price - pricebook.transaction_fee)}/mo
          </span>
        </p>
        <p data-flex="ab sb">
          <span class="h3 half">Likes:</span>
          <span class="h3 half">
            {(
              (pricebook.current_mode === 'free_mode' ? 0 : 50) + pricebook.like_pack
            ).toString()}/mo
          </span>
        </p>
        {#if pricebook.current_mode !== 'free_mode'}
          <Help summary="Details" small half>
            <p data-flex="ab sb">
              <span class="h3 half">Base price:</span>
              <span class="h3 half">{formatCents(199)}/mo</span>
            </p>
            <p data-flex="ab sb">
              <span class="h3 half">Add-ons:*</span>
              <span class="h3 half">
                {formatCents(pricebook.like_pack + pricebook.turbo)}/mo
              </span>
            </p>
            {#if pricebook.transaction_fee}
              <p data-flex="ab sb">
                <span class="h3 half">Transaction fee:</span>
                <span class="h3 half">
                  {formatCents(pricebook.transaction_fee)}/mo
                </span>
              </p>
            {/if}
            <p data-flex="ab sb">
              <span class="h3 half">Grand total:</span>
              <span class="h3 half">{formatCents(price)}/mo</span>
            </p>

            <p class="half xsmall">
              * Add-ons are coming soon. Subscribe to Unlimited after you <a
                href="#onboarding"
                class="strong"
                on:click|preventDefault={() => {
                  $App.sheet_id = 'onboarding';
                }}>get a free account</a
              >. {#if pricebook.turbo}Turbo is coming soon.{/if}
              {#if pricebook.like_pack}Like packs are coming soon.{/if} Final price subject
              to change. Estimated grand total: {formatCents(price)}/mo. Includes
              transaction fees of {formatCents(pricebook.transaction_fee)}/mo.
              Pocketrides' operating income: $1.49/mo.
            </p>
          </Help>
        {/if}
      </div>
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

  // coming soon
  .cs {
    padding: 4px;
    border-radius: 0.25rem;
    font-size: 0.777rem;
  }
</style>
