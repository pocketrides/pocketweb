<script lang="ts">
  import type { Writable } from 'svelte/store';
  import type { LayoutData } from '../$types';
  import { nav_items } from './nav_items';
  import { page } from '$app/stores';
  import Button from '$lib/components/Button.svelte';
  import Container from '$lib/components/Container.svelte';

  export let page_controller: Writable<LayoutData>;
</script>

<Container>
  <nav data-flex="ac">
    {#each nav_items as nav_item (nav_item)}
      {#if $page.route.id === nav_item.routeId}
        <Button
          id={nav_item.id}
          label={nav_item.label}
          icon={nav_item.icon}
          href={nav_item.href.replace(
            '[nametag_id]',
            $page_controller.page_nametag.id
          )}
          primary
          small
        />
      {:else}
        <Button
          id={nav_item.id}
          label={nav_item.label}
          icon={nav_item.icon}
          href={nav_item.href.replace(
            '[nametag_id]',
            $page_controller.page_nametag.id
          )}
          transparent
          small
        />
      {/if}
    {/each}
  </nav>
</Container>
