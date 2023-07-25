<script lang="ts">
  import Container from '$lib/components/Container.svelte';
  import Icon from '$lib/components/Icon.svelte';
  import LinkDisplay from '$lib/components/LinkDisplay.svelte';
  import LinkList from '$lib/components/LinkList.svelte';
  import type { ServerPocket } from '$lib/zod/Pocket';
  import type { Writable } from 'svelte/store';

  export let pocket: Writable<ServerPocket>;
</script>

{#if $pocket.details.links?.length}
  <Container padded={false}>
    <p class="strong small half" data-padded="h">
      <Icon icon="link" />
      Links
    </p>
    <LinkList padded="hb">
      {#each $pocket.details.links as link (link)}
        <LinkDisplay {link} />
      {/each}
    </LinkList>
  </Container>
{/if}
