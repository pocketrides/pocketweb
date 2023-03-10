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
    'idle'
  ];
  const completed_statuses: ServerPayout['status'][] = ['transferred'];

  const in_progress = writable<ServerPayout[]>(
    getPayouts(in_progress_statuses, data.payouts_feed.post_ids)
  );

  const completed = writable<ServerPayout[]>(
    getPayouts(completed_statuses, data.payouts_feed.post_ids)
  );

  const redirecting_to_stripe = writable(false);

  const redirectToStripe = () => {
    $redirecting_to_stripe = true;
  };

  let account_disabled =
    typeof data.stripe_account?.requirements?.disabled_reason === 'string';
  let disabled_reason = account_disabled
    ? data.stripe_account?.requirements?.disabled_reason
    : undefined;
  let can_create_payouts =
    data.can_create_account &&
    data.stripe_account?.charges_enabled === true &&
    account_disabled === false;
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
          {#if data.can_create_payouts}
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
    <HowPayoutsWork
      step1_done={data.can_create_account}
      step2_done={typeof data.stripe_account !== 'undefined'}
      step3_hidden={account_disabled}
      step3_hidden_reason={disabled_reason === 'requirements.pending_verification'
        ? 'Pending Verification'
        : 'Heads up!'}
      step3_hidden_icon={disabled_reason === 'requirements.pending_verification'
        ? 'verified'
        : 'error_outline'}
    >
      {#if can_create_payouts}
        <Button
          href="/settings/payouts/payout"
          label={$redirecting_to_stripe ? 'One sec!' : 'New Payout'}
          icon="attach_money"
          disabled={$redirecting_to_stripe}
          xlarge
          primary
          on:click={redirectToStripe}
        />
      {:else if data.can_create_account}
        {#if account_disabled}
          {#if disabled_reason === 'requirements.pending_verification'}
            <h3>Your Stripe account is pending verification.</h3>
          {:else}
            <h3>Your Stripe account needs attention.</h3>
          {/if}
          <Button
            href="/_/stripe/account/onboard"
            label={$redirecting_to_stripe
              ? 'One sec!'
              : 'Manage your Stripe account'}
            disabled={$redirecting_to_stripe}
            xlarge
            primary
            on:click={redirectToStripe}
          />
        {:else}
          <Button
            href="/_/stripe/account/onboard"
            label={$redirecting_to_stripe ? 'One sec!' : 'Create Stripe account'}
            disabled={$redirecting_to_stripe}
            xlarge
            primary
            on:click={redirectToStripe}
          />
        {/if}
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
      <Button href="/settings" label="Go back" />
    </HowPayoutsWork>
  </div>
</Main>
