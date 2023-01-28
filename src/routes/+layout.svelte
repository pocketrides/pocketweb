<script lang="ts">
  import { browser } from '$app/environment';
  import { page } from '$app/stores';
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
</script>

<slot />
