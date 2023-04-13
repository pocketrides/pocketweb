<script lang="ts">
  import Button from '$lib/components/Button.svelte';
  import Container from '$lib/components/Container.svelte';
  import Logo from '$lib/components/Logo.svelte';
  import Main from '$lib/components/Main.svelte';
  import SiteHeader from '$lib/components/SiteHeader.svelte';
  import UtilityNav from '$lib/components/UtilityNav.svelte';
  import { App } from '$lib/stores/app';
  import { onMount } from 'svelte';
  import { fly } from 'svelte/transition';

  $: $App.theme = 'system';
  $: $App.fill = 'system-superlight';

  $: ready = false;

  onMount(() => {
    ready = true;
  });
</script>

<svelte:head>
  <title>welcome welcome! it's pocketrides!</title>
</svelte:head>

<SiteHeader>
  <div slot="right">
    <Button label="Sign in" on:click={() => ($App.sheet_id = 'onboarding')} />
  </div>
</SiteHeader>
<Main fullheight>
  <div data-flex="v" data-gap="1" class="home">
    <Container padded rounded fill="system-superlight">
      <div class="card" data-flex="ae">
        <div data-flex="v">
          <h1 class="jumbo" data-flex="v">
            {#if ready}
              <span in:fly|local={{ y: 50, duration: 550 }}>
                <Logo />
              </span>
              <span in:fly|local={{ y: 50, duration: 550, delay: 75 }}>
                The place
              </span>
              <span in:fly|local={{ y: 50, duration: 550, delay: 150 }}>
                to be you again.
              </span>
            {/if}
          </h1>
        </div>
      </div>
    </Container>
    <Container>
      <h2>
        A social network for the next generation:
        <span class="half">
          plan anything, share everything, get paid along the way.
        </span>
      </h2>
      <h2>Welcome to Pocketrides<em>!</em></h2>
    </Container>
    <Container rounded fill="system-superlight">
      <div class="card">
        <h2>Pockets</h2>
      </div>
    </Container>
    <Container>
      <div class="card">
        <h2>Nametags</h2>
      </div>
    </Container>
    <Container>
      <div class="card">
        <h2>Coming Soon</h2>
      </div>
    </Container>
  </div>
  <UtilityNav slot="utility-nav">
    <div slot="left">
      <Button
        label="Get free account"
        icon="hail"
        system
        on:click={() => ($App.sheet_id = 'onboarding')}
      />
    </div>
  </UtilityNav>
</Main>

<style lang="scss">
  .home :global(.padded + .padded) {
    padding-top: 1rem;
  }

  .card {
    aspect-ratio: 9/16;
    max-height: 420px;
    width: 100%;
  }
</style>
