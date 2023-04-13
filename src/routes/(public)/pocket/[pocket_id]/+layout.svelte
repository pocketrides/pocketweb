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
  $: $App.fill = 'dark';
  $: privacy_mode =
    $pocket.settings.joinability === 'moderated'
      ? $my_membership?.status === 'joined' || $my_membership?.status === 'admin'
        ? false
        : true
      : false;
</script>

<svelte:head>
  <title>
    {name_plaintext}, hosted by {$pocket.nametag.nametag} | on pocketrides!
  </title>
  {#if og_image}
    <meta property="og:image" content={og_image} />
  {/if}
  <meta
    property="og:title"
    content={`${name_plaintext}, hosted by ${$pocket.nametag.nametag} on pocketrides!`}
  />
  {#if $pocket.details.desc_raw}
    <meta property="og:description" content={$pocket.details.desc_raw} />
    <meta name="description" content={$pocket.details.desc_raw} />
  {:else}
    <meta property="og:description" content={name_plaintext} />
    <meta name="description" content={name_plaintext} />
  {/if}
</svelte:head>

<SiteHeader fill="dark" huddable>
  <Gallery slot="gallery" photos={$pocket.cover_art} square={false} />
  <PocketRenderer
    details_enabled={$pocket.details_enabled}
    default_fill={privacy_mode ? 'light' : 'superlight'}
    round_last={false}
    bind:privacy_mode
  >
    <Name {pocket} {my_membership} slot="name" bind:privacy_mode />
    <Time {pocket} slot="time" />
    <Place {pocket} slot="place" />
    <Description {pocket} slot="desc" />
    <Links {pocket} slot="links" />
  </PocketRenderer>
  <PocketNav slot="nav" {pocket} bind:privacy_mode />
</SiteHeader>

{#if privacy_mode === false}
  <div
    class:hoist={$pocket.settings.joinability !== 'broadcast'}
    data-fill="system-light"
  >
    <slot />
  </div>
{:else}
  <slot />
{/if}

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

<style lang="scss">
  .hoist {
    margin-top: -2rem;
    padding-top: 2rem;
  }
</style>
