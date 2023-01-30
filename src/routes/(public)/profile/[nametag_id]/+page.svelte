<script lang="ts">
  import Main from '$lib/components/Main.svelte';
  import SiteHeader from '$lib/components/SiteHeader.svelte';
  import type { PageData } from './$types';
  import ProfileHeader from './ui/ProfileHeader.svelte';

  export let data: PageData;
</script>

<svelte:head>
  <title>{data.page_nametag.nametag} is on pocketrides!</title>
</svelte:head>

<SiteHeader>
  <ProfileHeader {data} />
</SiteHeader>
<Main />
