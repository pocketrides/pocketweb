<script lang="ts">
  import { page } from '$app/stores';
  import Button from '$lib/components/Button.svelte';
  import Icon from '$lib/components/Icon.svelte';
  import Main from '$lib/components/Main.svelte';
  import Sheet from '$lib/components/Sheet.svelte';
  import SiteHeader from '$lib/components/SiteHeader.svelte';
  import CollabNametag from '$lib/forms/nametag/CollabNametag.svelte';
  import DeleteNametag from '$lib/forms/nametag/DeleteNametag.svelte';
  import EditNametag from '$lib/forms/nametag/EditNametag.svelte';
  import NewNametag from '$lib/forms/nametag/NewNametag.svelte';
  import EnablePayouts from '$lib/sheets/settings/EnablePayouts.svelte';
  import { App } from '$lib/stores/app';
  import { nametagCreateComplete } from '$lib/util/nametag';
  import { onMount } from 'svelte';
  import type { PageData } from './$types';
  import { trackGoal } from 'fathom-client';
  import { IDBFeedCache } from '$lib/util/idb-feed-cache';
  import { IDBCache } from '$lib/util/idb-cache';

  export let data: PageData;

  // $App.fill = 'system-light';

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
  <title>account settings for {data.my_nametag?.nametag} | on pocketrides!</title>
</svelte:head>

<SiteHeader utility sticky>
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
<Main fullheight fill="white">
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
          <Button
            label="Subscribe"
            href="/_/stripe/pay"
            icon="favorite"
            jumbo
            on:click={() => {
              trackGoal('ZOOQK7CR', 1);
            }}
          />
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
        <Button
          label="New Nametag"
          icon="sentiment_very_satisfied"
          jumbo
          on:click={() => {
            $App.sheet_id = 'new_nametag';
          }}
        />
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
          on:click={async () => {
            await IDBFeedCache.clear();
            await IDBCache.clear();
            sessionStorage?.clear();

            location.pathname = '/settings/sign-out';
          }}
        />
        <Button
          label="Delete Nametag"
          icon="sentiment_very_dissatisfied"
          jumbo
          on:click={() => {
            $App.sheet_id = 'nametag_delete';
          }}
        />
      </div>
    </div>
  </div>
</Main>

<Sheet id="edit_nametag" header="Edit nametag" icon="face" close="Cancel">
  <EditNametag />
</Sheet>

<Sheet
  id="new_nametag"
  header="New nametag"
  icon="sentiment_very_satisfied"
  close="Cancel"
>
  <NewNametag on:complete={nametagCreateComplete} />
</Sheet>

<Sheet
  id="nametag_collab"
  header="Nametag Collab"
  icon="face_retouching_natural"
  close="Done"
  padded={false}
>
  <CollabNametag />
</Sheet>

<Sheet
  id="nametag_delete"
  header="Delete nametag"
  icon="sentiment_very_dissatisfied"
>
  <DeleteNametag />
</Sheet>

<EnablePayouts />
