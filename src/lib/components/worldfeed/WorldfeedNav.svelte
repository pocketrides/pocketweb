<script lang="ts">
  import { page } from '$app/stores';
  import Button from '$lib/components/Button.svelte';
  import Container from '$lib/components/Container.svelte';
</script>

<Container>
  <nav data-flex="ac">
    {#if $page.url.pathname === '/worldfeed'}
      <Button label="Home" icon="chair" href="/" transparent small />
      <Button
        label="Worldfeed"
        icon="public"
        href={$page.url.toString()}
        primary
        small
      />
    {:else}
      <Button label="Home" icon="chair" href="/" primary small />
      <Button label="Worldfeed" icon="public" href="/worldfeed" transparent small />
    {/if}
  </nav>
</Container>
