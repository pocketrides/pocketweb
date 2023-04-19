<script lang="ts">
  import Button from '$lib/components/Button.svelte';
  import Main from '$lib/components/Main.svelte';
  import SiteHeader from '$lib/components/SiteHeader.svelte';
  import { formatDate } from '$lib/util/time-ago';
  import PayoutDetail from '../../ui/PayoutDetail.svelte';
  import type { PageData } from './$types';

  export let data: PageData;

  let payout_date = new Date(data.payout.ts / 1000);
  payout_date.setHours(payout_date.getHours() + 96);
  let est_payout_date = payout_date;
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
    {#if data.payout.status === 'transferred'}
      <h2>
        Transferred! <span class="half">You did it!</span>
      </h2>
      <p>
        Watch for funds to hit your Stripe account around {formatDate(
          est_payout_date
        )}.
      </p>
      <Button
        label="Open Stripe"
        href="https://stripe.com"
        target="_blank"
        primary
        large
      />
    {/if}
  </div>
</Main>
