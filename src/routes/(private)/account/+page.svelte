<script lang="ts">
  import Button from '$lib/components/Button.svelte';
  import Icon from '$lib/components/Icon.svelte';
  import Main from '$lib/components/Main.svelte';
  import Sheet from '$lib/components/Sheet.svelte';
  import SiteHeader from '$lib/components/SiteHeader.svelte';
  import EditNametag from '$lib/forms/nametag/EditNametag.svelte';
  import { App } from '$lib/stores/app';
  import type { PageData } from './$types';

  export let data: PageData;

  $App.fill = 'superlight';
</script>

<svelte:head>
  <title>account settings for {data.my_nametag?.nametag} | pocketrides!</title>
</svelte:head>

<SiteHeader />
<Main>
  <div data-flex="v" data-gap="1">
    <h1 data-ph>
      <Icon icon="settings_suggest" />
      Settings
    </h1>
    <div data-flex="v" data-gap>
      <h2 class="h3 half">Most used</h2>
      <div data-flex="vs" data-gap>
        <Button
          label="Edit nametag"
          icon="face"
          jumbo
          on:click={() => {
            $App.sheet_id = 'edit_nametag';
          }}
        />
        <Button label="Get paid" icon="attach_money" jumbo href="/account/payouts" />
        <Button label="Notifications" icon="campaign" jumbo />
        <Button label="Enable 2FA" icon="fingerprint" jumbo />
      </div>
    </div>

    <div data-flex="v" data-gap>
      <h2 class="h3 half">Your subscription</h2>
      {#if data.account?.stripe_subscription_status === 'subscribed'}
        <div data-flex="vs" data-gap>
          <Button label="Stripe dashboard" icon="account_balance" jumbo />
          <Button label="Cancel subscription" icon="cancel" jumbo />
        </div>
      {:else}
        <div data-flex="vs" data-gap>
          <Button label="Subscribe" icon="favorite" jumbo />
        </div>
      {/if}
    </div>
    <div data-flex="v" data-gap>
      <h2 class="h3 half">Your account</h2>
      <div data-flex="vs" data-gap>
        <Button
          label="Sign out"
          icon="logout"
          jumbo
          primary
          on:click={() => {
            location.pathname = '/account/sign-out';
          }}
        />
        <Button label="Delete account" icon="sentiment_very_dissatisfied" jumbo />
      </div>
    </div>
  </div>
</Main>

<Sheet header="Edit nametag" icon="face" id="edit_nametag" close="Cancel">
  <EditNametag />
</Sheet>
