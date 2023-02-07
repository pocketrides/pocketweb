<script lang="ts">
  import Main from '$lib/components/Main.svelte';
  import SiteHeader from '$lib/components/SiteHeader.svelte';
  import { App } from '$lib/stores/app';

  $App.fill = 'superlight';
</script>

<svelte:head>
  <title>pocketrides!</title>
</svelte:head>

<SiteHeader />
<Main>
  <h1>Welcome home!</h1>
</Main>
