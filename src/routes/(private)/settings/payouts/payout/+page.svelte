<script lang="ts">
  import { invalidateAll } from '$app/navigation';
  import Button from '$lib/components/Button.svelte';
  import Main from '$lib/components/Main.svelte';
  import SiteHeader from '$lib/components/SiteHeader.svelte';
  import { writable } from 'svelte/store';
  import PayoutDetail from '../ui/PayoutDetail.svelte';
  import type { PageData } from './$types';

  export let data: PageData;

  const is_refreshing = writable(false);

  const startClick = async () => {
    $is_refreshing = true;
    const fd = new FormData();
    fd.append('payout_id', data.payout.id);

    await fetch('?/start', {
      method: 'POST',
      body: fd
    });
    await invalidateAll();
    $is_refreshing = false;
  };

  const refreshClick = async () => {
    $is_refreshing = true;
    await invalidateAll();
    $is_refreshing = false;
  };

  const transferClick = async () => {
    $is_refreshing = true;
    const fd = new FormData();
    fd.append('payout_id', data.payout.id);

    await fetch('?/transfer', {
      method: 'post',
      body: fd
    });

    await invalidateAll();
    $is_refreshing = false;
  };
</script>

<svelte:head>
  <title>payout for {data.my_nametag?.nametag} | on pocketrides!</title>
</svelte:head>

<SiteHeader utility sticky>
  <div slot="left">
    <Button icon="arrow_back_ios" label="Payouts" href="/settings/payouts" />
  </div>
  <div slot="right" />
</SiteHeader>
<Main fullheight>
  <div data-flex="v as" data-gap="1">
    <PayoutDetail payout={data.payout} />
    {#if data.payout.status === 'idle'}
      <Button
        label="Tap to start"
        disabled={$is_refreshing}
        large
        primary
        on:click={startClick}
      />
    {/if}
    {#if data.payout.status === 'processing'}
      <Button
        icon="autorenew"
        label={$is_refreshing ? 'Refreshing…' : 'Refresh'}
        disabled={$is_refreshing}
        large
        primary
        on:click={refreshClick}
      />
    {/if}
    {#if data.payout.status === 'processing_error' && data.payout.error_status === 'needs_restart'}
      <h2>
        Something went wrong! <span class="thin">Let's try that again.</span>
      </h2>
      <Button
        label="Tap to start"
        disabled={$is_refreshing}
        large
        primary
        on:click={startClick}
      />
    {/if}
    {#if data.payout.status === 'transfer_ready'}
      <Button
        icon="paid"
        label={$is_refreshing ? 'Transferring to Stripe…' : 'Transfer to Stripe'}
        disabled={$is_refreshing}
        large
        primary
        on:click={transferClick}
      />
    {/if}
    {#if data.payout.status === 'processing_error' && data.payout.error_status === 'failed_transfer'}
      <h2>
        Something went wrong! <span class="thin">Let's try that again.</span>
      </h2>
      <Button
        label={$is_refreshing ? 'One sec!' : 'Try again'}
        disabled={$is_refreshing}
        large
        primary
        on:click={transferClick}
      />
      <p><strong>Optional:</strong> Check your Stripe account for any issues.</p>
      <Button
        label="Check Stripe account"
        large
        primary
        href="/_/stripe/account/onboard"
      />
    {/if}
  </div>
</Main>
