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
  <PocketRenderer
    details_enabled={$pocket.details_enabled}
    default_fill="superlight"
  >
    <Name {pocket} slot="name" />
  </PocketRenderer>
  <PocketNav slot="nav" {pocket} {my_membership} />
</SiteHeader>

<div data-fill="light">
  <slot />
</div>

<style lang="scss">
  div {
    margin-top: -2rem;
    padding-top: 2rem;
  }
</style>
