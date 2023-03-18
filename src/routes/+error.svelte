<script lang="ts">
  import Button from '$lib/components/Button.svelte';
  import Container from '$lib/components/Container.svelte';
  import Main from '$lib/components/Main.svelte';
  import SiteHeader from '$lib/components/SiteHeader.svelte';
  import { App } from '$lib/stores/app';

  $App.fill = 'superlight';
  $App.loading = false;
</script>

<svelte:head>
  <title>Something broke! | pocketrides</title>
</svelte:head>

<SiteHeader />
<Main fullheight>
  <Container fill="dark" rounded>
    <h1 class="h2">Something broke!</h1>
    <p>We'll try and fix it.</p>
    <Button href="/" label="Back home" />
  </Container>
</Main>

<style lang="scss">
  p {
    margin-bottom: 3rem;
  }
</style>
