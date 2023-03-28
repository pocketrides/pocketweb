<script lang="ts">
  import { NametagRelationshipsRequest } from '$lib/api/nametag/relationships';
  import type { ClientNametag } from '$lib/zod/Nametag';
  import { onDestroy, onMount } from 'svelte';
  import { writable } from 'svelte/store';

  export let friends_for: string;
  export let exclude_ids: string[] = [];

  const friends = writable<ClientNametag[]>([]);

  onMount(async () => {
    const req = await NametagRelationshipsRequest.getFriends(friends_for);

    if (req.success) {
      friends.update(() => {
        return req.nametags;
      });
    }
  });

  onDestroy(() => {
    $friends = [];
  });
</script>

<ul data-unstyle data-flex="v">
  {#each $friends as nametag (nametag)}
    {#if exclude_ids.indexOf(nametag.id) === -1}
      <li>
        <slot {nametag} />
      </li>
    {/if}
  {/each}
</ul>
