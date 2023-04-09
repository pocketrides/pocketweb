<script lang="ts">
  import { page } from '$app/stores';
  import Button from '$lib/components/Button.svelte';
  import Container from '$lib/components/Container.svelte';
  import { nav_items } from './nav_items';
  import type { Fill } from '$lib/zod/Fill';
  import type { Writable } from 'svelte/store';
  import type { ServerPocket } from '$lib/zod/Pocket';
  import type { ClientPocketMember } from '$lib/zod/PocketMember';

  export let pocket: Writable<ServerPocket>;
  export let my_membership: Writable<ClientPocketMember | undefined>;
  export let outer_fill: Fill = 'light';
</script>

{#if $pocket.settings.joinability !== 'broadcast'}
  <div data-fill="superlight">
    <Container>
      <nav data-flex="ac">
        {#each nav_items as nav_item (nav_item)}
          {#if $page.route.id === nav_item.routeId}
            <Button
              id={nav_item.id}
              label={nav_item.label}
              icon={nav_item.icon}
              href={nav_item.href.replace('[pocket_id]', $page.params.pocket_id)}
              primary
              small
            />
          {:else}
            <Button
              id={nav_item.id}
              label={nav_item.label}
              icon={nav_item.icon}
              href={nav_item.href.replace('[pocket_id]', $page.params.pocket_id)}
              transparent
              small
            />
          {/if}
        {/each}
      </nav>
    </Container>
  </div>
{/if}
