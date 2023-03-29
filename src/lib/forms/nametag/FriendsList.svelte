<script lang="ts">
  import { NametagRelationshipsRequest } from '$lib/api/nametag/relationships';
  import Nametag from '$lib/components/Nametag.svelte';
  import NametagWithPic from '$lib/components/NametagWithPic.svelte';
  import type { ClientNametag } from '$lib/zod/Nametag';
  import { onDestroy, onMount } from 'svelte';
  import { writable } from 'svelte/store';

  export let friends_for: string;
  export let exclude_ids: string[] = [];
  export let flex: string = `v as`;
  export let gap: boolean = true;

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

<ul data-unstyle data-flex={flex} data-gap={gap || undefined}>
  {#each $friends as nametag (nametag)}
    {#if exclude_ids.indexOf(nametag.id) === -1}
      <li>
        <slot {nametag}>
          <div>
            <NametagWithPic {nametag} large />
          </div>
        </slot>
      </li>
    {/if}
  {/each}
</ul>
