<script lang="ts">
  import Button from '$lib/components/Button.svelte';
  import Icon from '$lib/components/Icon.svelte';
  import Main from '$lib/components/Main.svelte';
  import Sheet from '$lib/components/Sheet.svelte';
  import SiteHeader from '$lib/components/SiteHeader.svelte';
  import { App } from '$lib/stores/app';
  import { onMount } from 'svelte';
  import HowPayoutsWork from '../ui/HowPayoutsWork.svelte';

  onMount(() => {
    if (new URLSearchParams(location.search).has('quickstart')) {
      history.replaceState({}, '', location.toString().replace('?quickstart=1', ''));
      quickstart();
    }
  });

  const quickstart = () => {
    $App.sheet_id = 'payout_select_content';
  };
</script>

<SiteHeader utility>
  <div slot="left">
    <h1 class="h2">
      <Icon icon="attach_money" />
      New payout
    </h1>
  </div>
  <div slot="right">
    <Button label="Cancel" href="/account/payouts" />
  </div>
</SiteHeader>
<Main>
  <div data-flex="v" data-gap="1">
    <HowPayoutsWork>
      <Button label="Get started" primary xlarge on:click={quickstart} />
      <Button label="Go back" href="/account/payouts" />
    </HowPayoutsWork>
  </div>
</Main>
<Sheet id="payout_select_content" header="Select content" icon="edit" />
