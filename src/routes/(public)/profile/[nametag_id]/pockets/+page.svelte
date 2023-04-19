<script lang="ts">
  import Container from '$lib/components/Container.svelte';
  import Icon from '$lib/components/Icon.svelte';
  import NothingHere from '$lib/components/NothingHere.svelte';
  import PocketDisplay from '$lib/components/PocketDisplay.svelte';
  import Row from '$lib/components/Row.svelte';
  import PocketIntro from '$lib/components/pockets/PocketIntro.svelte';
  import type { PageData } from './$types';

  export let data: PageData;
</script>

{#if data.is_my_profile_page && data.joined_pockets.length}
  <Row padded bordered fill="system-light">
    <h2 slot="left">
      <Icon icon="hail" />
      Joined
    </h2>
  </Row>
  <Container>
    <div data-flex="w" data-gap>
      {#each data.joined_pockets as pocket (pocket)}
        <PocketDisplay {pocket} />
      {/each}
    </div>
  </Container>
{/if}

{#if !data.pockets.length && !data.cohosted_pockets.length && !data.unlisted_pockets.length}
  <Row padded bordered fill="system-light">
    <h2 slot="left">
      <Icon icon="hail" />
      Pockets
    </h2>
  </Row>
  <Container>
    {#if data.is_my_profile_page}
      <div data-flex="v" data-gap="1">
        <PocketIntro />
        <p class="small half" data-padded>
          <Icon icon="visibility_off" /> Only you can see this.
        </p>
      </div>
    {:else}
      <NothingHere />
    {/if}
  </Container>
{/if}

{#if data.pockets.length}
  <Row padded bordered fill="system-light">
    <h2 slot="left">
      <Icon icon="hail" />
      Pockets
    </h2>
  </Row>
  <Container>
    <div data-flex="w" data-gap>
      {#each data.pockets as pocket (pocket)}
        <PocketDisplay {pocket} />
      {/each}
    </div>
  </Container>
{/if}

{#if data.cohosted_pockets.length}
  <Row padded bordered fill="system-light">
    <h2 slot="left">
      <Icon icon="campaign" />
      Cohosted Pockets
    </h2>
  </Row>
  <Container>
    <div data-flex="w" data-gap>
      {#each data.cohosted_pockets as pocket (pocket)}
        <PocketDisplay {pocket} />
      {/each}
    </div>
  </Container>
{/if}

{#if data.is_my_profile_page && data.unlisted_pockets.length}
  <Row padded bordered fill="system-light">
    <h2 slot="left">
      <Icon icon="visibility_off" />
      Unlisted
    </h2>
  </Row>
  <Container>
    <div data-flex="w" data-gap>
      {#each data.unlisted_pockets as pocket (pocket)}
        <PocketDisplay {pocket} />
      {/each}
    </div>
  </Container>
{/if}
