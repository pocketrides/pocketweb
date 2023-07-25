<script lang="ts">
  import type { Writable } from 'svelte/store';
  import type { LayoutData } from '../$types';
  import { nav_items } from './nav_items';
  import { page } from '$app/stores';
  import Button from '$lib/components/Button.svelte';
  import Container from '$lib/components/Container.svelte';
  import { goto } from '$app/navigation';
  import { App } from '$lib/stores/app';

  export let page_controller: Writable<LayoutData>;

  $: selected_label = nav_items.filter((i) => i.routeId === $page.route.id)[0].label;
</script>

<Container>
  <nav data-flex="ae">
    <Button icon="unfold_more" label={selected_label} transparent xlarge />
    <select
      data-sham
      on:change={(e) => {
        goto(
          e.currentTarget.value.replace(
            '[nametag_id]',
            $page_controller.page_nametag.id
          )
        );

        $App.loading = true;
      }}
    >
      {#each nav_items as nav_item (nav_item)}
        {#if $page.route.id === nav_item.routeId}
          <option selected value={nav_item.href}>
            {nav_item.label}
          </option>
          <!-- <Button
          id={nav_item.id}
          label={nav_item.label}
          icon={nav_item.icon}
          href={nav_item.href.replace(
            '[nametag_id]',
            $page_controller.page_nametag.id
          )}
          primary
          small
        /> -->
        {:else}
          <option value={nav_item.href}>
            {nav_item.label}
          </option>
          <!-- <Button
          id={nav_item.id}
          label={nav_item.label}
          icon={nav_item.icon}
          href={nav_item.href.replace(
            '[nametag_id]',
            $page_controller.page_nametag.id
          )}
          transparent
          small
        /> -->
        {/if}
      {/each}
    </select>
  </nav>
</Container>
