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
</script>

<svelte:head>
  <title>Payout for {data.my_nametag?.nametag} | pocketrides!</title>
</svelte:head>

<SiteHeader utility>
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
  </div>
</Main>
