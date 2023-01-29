<script lang="ts">
  import { browser } from '$app/environment';
  import { afterNavigate, beforeNavigate } from '$app/navigation';
  import { page } from '$app/stores';
  import SiteFooter from '$lib/components/SiteFooter.svelte';
  import SiteLoader from '$lib/components/SiteLoader.svelte';
  import Onboarding from '$lib/sheets/Onboarding.svelte';
  import { App } from '$lib/stores/app';
  import '$lib/styles/global.scss';

  $: if (browser) {
    document.documentElement.setAttribute(
      'data-theme',
      $page.data.page_theme || $App.theme
    );
    document.documentElement.setAttribute('data-fill', $App.fill);
    document.documentElement.setAttribute(
      'data-locked',
      $App.sheet_id === '' ? 'false' : 'true'
    );
  }

  beforeNavigate(async () => {
    $App.loading = true;

    setTimeout(() => {
      $App.loading = false;
    }, 2000);
  });

  afterNavigate(() => {
    $App.loading = false;
  });
</script>

<svelte:head>
  <title>Pocketrides!</title>
</svelte:head>

<slot />
<SiteFooter />
<SiteLoader />
<Onboarding />
