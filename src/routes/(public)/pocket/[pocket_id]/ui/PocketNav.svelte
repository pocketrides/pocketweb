<script lang="ts">
  import { page } from '$app/stores';
  import Button from '$lib/components/Button.svelte';
  import Container from '$lib/components/Container.svelte';
  import { nav_items } from './nav_items';
  import type { ServerPocket } from '$lib/zod/Pocket';
  import type { Writable } from 'svelte/store';
  import { goto } from '$app/navigation';
  import { App } from '$lib/stores/app';

  export let pocket: Writable<ServerPocket>;
  export let privacy_mode: boolean = false;

  $: selected_label = nav_items.filter((i) => i.routeId === $page.route.id)[0].label;
</script>

{#if $pocket.settings.joinability !== 'broadcast' && privacy_mode === false}
  <Container>
    <nav data-flex="ae">
      <Button icon="unfold_more" label={selected_label} transparent xlarge />
      <select
        data-sham
        on:change={(e) => {
          goto(e.currentTarget.value.replace('[pocket_id]', $pocket.id));

          $App.loading = true;
        }}
      >
        {#each nav_items as nav_item (nav_item)}
          {#if nav_item.id === 'pending' && $page.route.id === nav_item.routeId && privacy_mode}
            <option value="" selected>{nav_item.label}</option>
          {:else if $page.route.id === nav_item.routeId}
            <option value={nav_item.href} selected>{nav_item.label}</option>
            <!-- <Button
            id={nav_item.id}
            label={nav_item.label}
            icon={nav_item.icon}
            href={nav_item.href.replace('[pocket_id]', $page.params.pocket_id)}
            primary
            small
          /> -->
          {:else}
            {#if !privacy_mode && nav_item.routeId !== '/(public)/pocket/[pocket_id]/pending'}
              <option value={nav_item.href}>{nav_item.label}</option>
            {/if}
            <!-- <Button
            id={nav_item.id}
            label={nav_item.label}
            icon={nav_item.icon}
            href={nav_item.href.replace('[pocket_id]', $page.params.pocket_id)}
            transparent
            small -->
            />
          {/if}
        {/each}
      </select>
    </nav>
  </Container>
{/if}
