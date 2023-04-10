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
  $App.fill = 'dark';
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
    default_fill="superlight"
  >
    <Name {pocket} slot="name" />
    <Time {pocket} slot="time" />
    <Place {pocket} slot="place" />
    <Description {pocket} slot="desc" />
    <Links {pocket} slot="links" />
  </PocketRenderer>
  <PocketNav slot="nav" {pocket} {my_membership} />
</SiteHeader>

<div data-fill="light">
  <slot />
</div>

<PocketMembersSheet {pocket} {my_membership} />
{#if $page.data.my_nametag?.stripe?.has_sub !== true}
  <JoinedMaxFree />
{/if}

<style lang="scss">
  div {
    margin-top: -2rem;
    padding-top: 2rem;
  }
</style>
