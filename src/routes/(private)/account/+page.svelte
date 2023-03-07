<script lang="ts">
  import { page } from '$app/stores';
  import Button from '$lib/components/Button.svelte';
  import Container from '$lib/components/Container.svelte';
  import Icon from '$lib/components/Icon.svelte';
  import Main from '$lib/components/Main.svelte';
  import Sheet from '$lib/components/Sheet.svelte';
  import SiteHeader from '$lib/components/SiteHeader.svelte';
  import EditNametag from '$lib/forms/nametag/EditNametag.svelte';
  import EnablePayouts from '$lib/sheets/account/EnablePayouts.svelte';
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
        {#if $page.data.my_nametag?.stripe?.has_account}
          {#if $page.data.my_nametag?.stripe?.charges_enabled}
            <Button
              label="Stripe dashboard"
              icon="account_balance"
              jumbo
              href="/_/stripe/account/link"
            />
            {#if $page.data.my_nametag?.stripe?.has_sub}
              <Button
                label="Cancel subscription"
                icon="favorite_border"
                jumbo
                href="/_/stripe/account/cancel"
              />
            {:else}
              <Button
                label="Become a subscriber"
                icon="favorite"
                jumbo
                href="/_/stripe/payment-link"
              />
            {/if}
          {:else}
            <Button
              label="Update settings"
              icon="account_balance"
              jumbo
              href="/_/stripe/account/onboard"
            />
          {/if}
        {:else}
          <Button
            label="Add payment account"
            icon="account_balance"
            jumbo
            href="/_/stripe/account/onboard"
          />
        {/if}
        <!-- {#if $page.data.my_nametag?.stripe?.has_account}
          <Button
            label="Get paid"
            icon="attach_money"
            jumbo
            href="/account/payouts"
          />
          <Button
            label="Stripe dashboard"
            icon="account_balance"
            jumbo
            on:click={() => {
              window.open('/_/stripe/account/link');
            }}
          />
        {:else}
          <Button
            label="Enable payouts"
            icon="account_balance"
            jumbo
            on:click={() => {
              $App.sheet_id = 'enable_payouts';
            }}
          />
        {/if} -->
        <!-- {#if $page.data.my_nametag?.stripe?.has_sub}
          <Button label="Cancel subscription" icon="cancel" jumbo />
        {:else}
          <Button label="Subscribe" icon="favorite" jumbo />
        {/if} -->
      </div>
    </div>

    <!-- <div data-flex="v" data-gap>
      <h2 class="h3 half">Settings</h2>
      <div data-flex="vs" data-gap>
        <Button label="Notifications" icon="campaign" jumbo />
        <Button label="Enable 2FA" icon="fingerprint" jumbo />
      </div>
    </div> -->
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
        <!-- <Button label="Delete account" icon="sentiment_very_dissatisfied" jumbo /> -->
      </div>
    </div>
  </div>
</Main>

<Sheet id="edit_nametag" header="Edit nametag" icon="face" close="Cancel">
  <EditNametag />
</Sheet>

<EnablePayouts />
