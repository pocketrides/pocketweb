<script lang="ts">
  import Button from '$lib/components/Button.svelte';
  import Icon from '$lib/components/Icon.svelte';
  import Main from '$lib/components/Main.svelte';
  import Row from '$lib/components/Row.svelte';
  import SiteHeader from '$lib/components/SiteHeader.svelte';
  import type { ServerPayout } from '$lib/zod/Payout';
  import { writable } from 'svelte/store';
  import type { PageData } from './$types';
  import HowPayoutsWork from './ui/HowPayoutsWork.svelte';
  import PayoutChip from './ui/PayoutChip.svelte';

  export let data: PageData;

  const getPayouts = (
    statuses: ServerPayout['status'][],
    payouts: ServerPayout[]
  ): ServerPayout[] => {
    return payouts.filter((p) => statuses.indexOf(p.status) > -1);
  };

  const in_progress_statuses: ServerPayout['status'][] = [
    'processing',
    'processing_error',
    'started'
  ];
  const completed_statuses: ServerPayout['status'][] = ['transferred'];

  const in_progress = writable<ServerPayout[]>(
    getPayouts(in_progress_statuses, data.payouts_feed.post_ids)
  );

  const completed = writable<ServerPayout[]>(
    getPayouts(completed_statuses, data.payouts_feed.post_ids)
  );
</script>

<svelte:head>
  <title>your payouts | pocketrides!</title>
</svelte:head>

<SiteHeader utility>
  <div slot="left">
    <Button icon="arrow_back_ios" label="Settings" href="/settings" />
  </div>
  <div slot="right" />
</SiteHeader>
<Main>
  <div data-flex="v" data-gap="1">
    <div data-ph>
      <Row>
        <div slot="left">
          <h1>
            <Icon icon="attach_money" />
            Payouts
          </h1>
        </div>
        <div slot="right">
          {#if data.payouts_enabled}
            <Button
              id="new_payout"
              icon="attach_money"
              href="/settings/payouts/payout"
              label="New payout"
            />
          {/if}
        </div>
      </Row>
    </div>
    {#if $in_progress.length}
      <div data-flex="v" data-gap>
        <h2 class="h3 half">In progress</h2>

        <div data-flex="vs" data-gap>
          {#each $in_progress as payout}
            <PayoutChip {payout} />
          {/each}
        </div>
      </div>
    {/if}
    {#if $completed.length}
      <div data-flex="v" data-gap>
        <h2 class="h3 half">Completed</h2>
        <div data-flex="vs" data-gap>
          {#each $completed as payout}
            <PayoutChip {payout} />
          {/each}
        </div>
      </div>
    {/if}
    <HowPayoutsWork>
      {#if data.payouts_enabled}
        <Button
          href="/settings/payouts/payout?quickstart=1"
          label="Get started"
          xlarge
          primary
        />
        <Button href="/settings" label="Go back" />
      {:else}
        <Button label="Get started" disabled xlarge primary />
        {#if data.total_likes}
          <p>
            <span class="h3">Almost there!</span>
            You have {data.total_likes} likes so far.
          </p>
        {:else}
          <p>Come back when you have more likes!</p>
        {/if}
      {/if}
    </HowPayoutsWork>
  </div>
</Main>
