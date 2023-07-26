<script lang="ts">
  import { writable } from 'svelte/store';
  import type { LayoutData } from './$types';
  import { getThumbnail } from '$lib/util/cloudinary';
  import { App } from '$lib/stores/app';
  import SiteHeader from '$lib/components/SiteHeader.svelte';
  import PocketNav from './ui/PocketNav.svelte';
  import PocketRenderer from '$lib/components/pockets/PocketRenderer.svelte';
  import Name from './ui/layout/Name.svelte';
  import type { ClientPocketMember } from '$lib/zod/PocketMember';
  import Place from './ui/layout/Place.svelte';
  import Time from './ui/layout/Time.svelte';
  import Description from './ui/layout/Description.svelte';
  import Links from './ui/layout/Links.svelte';
  import PocketMembersSheet from './ui/PocketMembersSheet.svelte';
  import Gallery from '$lib/components/Gallery.svelte';
  import JoinedMaxFree from '$lib/sheets/pockets/JoinedMaxFree.svelte';
  import { page } from '$app/stores';
  import Sheet from '$lib/components/Sheet.svelte';
  import ButtonRow from '$lib/components/ButtonRow.svelte';
  import PocketActions from './ui/PocketActions.svelte';
  import Icon from '$lib/components/Icon.svelte';

  export let data: LayoutData;

  const pocket = writable(data.pocket);
  const my_membership = writable<ClientPocketMember | undefined>(data.my_membership);

  $: name_plaintext = $pocket.name_raw.replace(/\n/g, ' ');

  $: $pocket = data.pocket;
  $: $my_membership = data.my_membership;
  $: has_image = $pocket.cover_art[0];
  $: og_image = has_image
    ? getThumbnail(has_image.version, has_image.public_id)
    : undefined;

  $: $App.theme = $pocket.theme;
  // $: $App.fill = 'dark';
  $: privacy_mode =
    $pocket.settings.joinability === 'moderated'
      ? $my_membership?.status === 'joined' || $my_membership?.status === 'admin'
        ? false
        : true
      : false;

  let is_scrolled = false;

  const handleScroll = () => {
    is_scrolled = window.scrollY >= 100;
  };
</script>

<svelte:window on:scroll={handleScroll} />

<svelte:head>
  <title>
    {name_plaintext} hosted by {$pocket.nametag.nametag}
  </title>
  {#if og_image}
    <meta property="og:image" content={og_image} />
  {/if}
  <meta
    property="og:title"
    content={`${name_plaintext} hosted by ${$pocket.nametag.nametag} on pocketrides!`}
  />
  {#if $pocket.details.desc_raw}
    <meta property="og:description" content={$pocket.details.desc_raw} />
    <meta name="description" content={$pocket.details.desc_raw} />
  {:else}
    <meta property="og:description" content={name_plaintext} />
    <meta name="description" content={name_plaintext} />
  {/if}
</svelte:head>

<SiteHeader huddable header_flex="sb at">
  <Gallery slot="gallery" photos={$pocket.cover_art} square={false} />
  <div slot="left" data-flex="v">
    <div data-flex data-gap>
      {#if $pocket.settings.visibility === 'unlisted'}
        <a
          href="#unlisted"
          class="half small"
          aria-label="Tap to learn about unlisted pockets"
          data-unstyle
          on:click|preventDefault={() => {
            $App.sheet_id = 'unlisted_howto';
          }}
        >
          <Icon icon="visibility_off" inline />
          Unlisted
        </a>
      {/if}
      {#if $pocket.settings.joinability === 'broadcast'}
        <a
          href="#broadcast"
          class="half small"
          aria-label="Tap to learn about broadcast mode"
          data-unstyle
          on:click|preventDefault={() => {
            $App.sheet_id = 'broadcast_howto';
          }}
        >
          <Icon icon="edit_off" inline />
          Broadcast Mode
        </a>
      {/if}
      {#if $pocket.settings.joinability === 'moderated'}
        <a
          href="#moderated"
          class="half small"
          aria-label="Tap to learn about private mode"
          data-unstyle
          on:click|preventDefault={() => {
            $App.sheet_id = 'moderated_howto';
          }}
        >
          <Icon icon="shield_with_heart" inline />
          Private Mode
        </a>
      {/if}
    </div>
    <h1 class:nowraps={is_scrolled}>
      {@html $pocket.name_raw}
    </h1>
  </div>
  <div data-flex="v" data-gap>
    <PocketRenderer
      details_enabled={$pocket.details_enabled}
      round_last={false}
      bind:privacy_mode
    >
      <Name {pocket} slot="name" bind:privacy_mode />
      <Time {pocket} slot="time" />
      <Place {pocket} slot="place" />
      <Description {pocket} slot="desc" />
      <Links {pocket} slot="links" />
    </PocketRenderer>
    <PocketActions {pocket} {my_membership} />
  </div>
  <PocketNav slot="nav" {pocket} bind:privacy_mode />
</SiteHeader>

<slot />

<PocketMembersSheet {pocket} {my_membership} />
{#if $page.data.my_nametag?.stripe?.has_sub !== true}
  <JoinedMaxFree />
{/if}

{#if $pocket.settings.visibility === 'unlisted'}
  <Sheet
    id="unlisted_howto"
    header="Unlisted pockets"
    icon="visibility_off"
    close="Done"
  >
    <div data-flex="v" data-gap>
      <h2>This pocket is unlisted.</h2>
      <p>
        Hosts could unlist their pocket for any number of reasons. Bottom line is, if
        it's unlisted, you should probably ask before sharing the link.
      </p>
    </div>
  </Sheet>
{/if}

{#if $pocket.settings.joinability === 'broadcast'}
  <Sheet id="broadcast_howto" header="Broadcast Mode" icon="edit_off" close="Done">
    <div data-flex="v" data-gap>
      <h2>How Broadcast Mode works</h2>
      <p>
        Hosts put their pocket in Broadcast Mode so you can follow it without being
        able to post or chat.
      </p>
      <p>
        Broadcast Mode is a great way to group content on Pocketrides: what's shared
        in a pocket only shows up on your home feed when you're following it and have
        notifications enabled.
      </p>
    </div>
  </Sheet>
{/if}

{#if $pocket.settings.joinability === 'moderated'}
  <Sheet
    id="moderated_howto"
    header="Private Mode"
    icon="shield_with_heart"
    close="Done"
  >
    <div data-flex="v" data-gap>
      <h2>How Private Mode works</h2>
      <p>
        Need to keep the group small? When a pocket's in Private Mode, you'll have to
        request to join.
      </p>
    </div>
  </Sheet>
{/if}
