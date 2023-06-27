<script lang="ts">
  import Button from '$lib/components/Button.svelte';
  import Container from '$lib/components/Container.svelte';
  import Main from '$lib/components/Main.svelte';
  import SiteHeader from '$lib/components/SiteHeader.svelte';
  import { App } from '$lib/stores/app';
  import { page } from '$app/stores';
  import ButtonRow from '$lib/components/ButtonRow.svelte';
  import type { PageData } from './$types';
  import { browser } from '$app/environment';

  $App.theme = 'system';
  $App.fill = 'light';

  export let data: PageData;

  $: if (browser && $page.data.my_nametag) {
    location.href = data.redirect;
  }
</script>

<svelte:head>
  <title>Try signing in | on pocketrides!</title>
</svelte:head>

<SiteHeader huddable />
<Main fullheight>
  <Container rounded bordered>
    <h1 class="h2">Try signing in.</h1>
    <p>The page you were trying to access requires you to be signed in.</p>
    <ButtonRow let:controller initial="try">
      {#if !$page.data.my_nametag}
        <Button
          id="try"
          {controller}
          label="Try signing in"
          icon="hail"
          on:click={() => {
            $App.sheet_id = 'onboarding';
          }}
        />
      {/if}
      <Button {controller} icon="home" icon_filled href="/" label="Go home" />
    </ButtonRow>
  </Container>
</Main>

<style lang="scss">
  p {
    margin-bottom: 3rem;
  }
</style>
