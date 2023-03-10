<script lang="ts">
  import Button from '$lib/components/Button.svelte';
  import Main from '$lib/components/Main.svelte';
  import SiteHeader from '$lib/components/SiteHeader.svelte';
  import PayoutDetail from '../../ui/PayoutDetail.svelte';
  import type { PageData } from './$types';

  export let data: PageData;
</script>

<SiteHeader utility>
  <div slot="left">
    <Button icon="arrow_back_ios" label="Payouts" href="/settings/payouts" />
  </div>
  <div slot="right" />
</SiteHeader>
<Main>
  <PayoutDetail payout={data.payout} />
</Main>
