<script lang="ts">
  import { NametagRelationshipsRequest } from '$lib/api/nametag/relationships';
  import NametagWithPic from '$lib/components/NametagWithPic.svelte';
  import type { ClientNametag } from '$lib/zod/Nametag';
  import { onDestroy, onMount } from 'svelte';
  import { writable } from 'svelte/store';

  export let followers_for: string;
  export let exclude_ids: string[] = [];
  export let flex: string = `v as`;
  export let gap: boolean = true;

  const followers = writable<ClientNametag[]>([]);

  onMount(async () => {
    const req = await NametagRelationshipsRequest.getFollowers(followers_for);

    if (req.success) {
      followers.update(() => {
        return req.nametags;
      });
    }
  });

  onDestroy(() => {
    $followers = [];
  });
</script>

<ul data-unstyle data-flex={flex} data-gap={gap || undefined}>
  {#if $followers.length === 0}
    <li>
      <p class="h3 half">Nothing here… <span class="half">yet<em>!</em></span></p>
    </li>
  {/if}
  {#each $followers as nametag (nametag)}
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
