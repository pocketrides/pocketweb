<script lang="ts">
  import { page } from '$app/stores';
  import Button from '$lib/components/Button.svelte';
  import Icon from '$lib/components/Icon.svelte';
  import Main from '$lib/components/Main.svelte';
  import Sheet from '$lib/components/Sheet.svelte';
  import SiteHeader from '$lib/components/SiteHeader.svelte';
  import CollabNametag from '$lib/forms/nametag/CollabNametag.svelte';
  import EditNametag from '$lib/forms/nametag/EditNametag.svelte';
  import EnablePayouts from '$lib/sheets/settings/EnablePayouts.svelte';
  import { App } from '$lib/stores/app';
  import { onMount } from 'svelte';
  import type { PageData } from './$types';

  export let data: PageData;

  $App.fill = 'superlight';

  onMount(() => {
    const sp = new URLSearchParams(window.location.search);

    if (sp.get('s') === 'collab') {
      setTimeout(() => {
        $App.sheet_id = 'nametag_collab';
      }, 1000);

      history.replaceState({}, '', location.toString().replace('?s=collab', ''));
    }
  });
</script>

<svelte:head>
  <title>account settings for {data.my_nametag?.nametag} | pocketrides!</title>
</svelte:head>

<SiteHeader utility>
  <div slot="left">
    <Button
      label={$page.data.my_nametag?.nametag || ''}
      href={`/profile/${$page.data.my_nametag?.id}`}
      icon="arrow_back_ios"
      primary
      small
    />
  </div>
  <div slot="right" />
</SiteHeader>
<Main fullheight>
  <div data-flex="v" data-gap="1">
    <h1 data-ph>
      <Icon icon="settings_suggest" />
      Settings
    </h1>
    <div data-flex="v" data-gap>
      <h2 class="h3 half">Most used</h2>
      <div data-flex="vs" data-gap>
        <Button
          label="Get paid"
          icon="attach_money"
          jumbo
          href="/settings/payouts"
        />
        {#if $page.data.my_nametag?.stripe?.sub_id}
          <Button
            label="Manage subscription"
            icon="favorite"
            href="/_/stripe/account/manage"
            jumbo
          />
        {:else}
          <Button label="Subscribe" href="/_/stripe/pay" icon="favorite" jumbo />
        {/if}
      </div>
    </div>
    <div data-flex="v" data-gap>
      <h2 class="h3 half">Nametags</h2>
      <div data-flex="vs" data-gap>
        <Button
          label="Edit yours"
          icon="face"
          jumbo
          on:click={() => {
            $App.sheet_id = 'edit_nametag';
          }}
        />
        <Button label="New Nametag" icon="sentiment_very_satisfied" jumbo />
        <Button
          label="Nametag Collab"
          icon="face_retouching_natural"
          jumbo
          on:click={() => {
            $App.sheet_id = 'nametag_collab';
          }}
        />
      </div>
    </div>
    <div data-flex="v" data-gap>
      <h2 class="h3 half">Other stuff</h2>
      <div data-flex="vs" data-gap>
        <Button
          label="Content settings"
          icon="auto_stories"
          jumbo
          href="/settings/content"
        />
        <!-- <Button label="Notifications" icon="campaign" jumbo /> -->
        <!-- <Button label="Enable 2FA" icon="fingerprint" jumbo /> -->
      </div>
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
            location.pathname = '/settings/sign-out';
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

<Sheet
  id="nametag_collab"
  header="Nametag Collab"
  icon="face_retouching_natural"
  close="Cancel"
  padded={false}
>
  <CollabNametag />
</Sheet>

<EnablePayouts />
