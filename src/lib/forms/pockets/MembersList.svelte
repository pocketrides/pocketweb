<script lang="ts">
  import { PocketMemberListRequest } from '$lib/api/pocket/members/list';
  import Row from '$lib/components/Row.svelte';
  import type { ClientPocketMember } from '$lib/zod/PocketMember';
  import { createEventDispatcher, onDestroy, onMount } from 'svelte';
  import { writable } from 'svelte/store';

  export let pocket_id: string;
  export let joined_only: boolean = true;

  const members = writable<ClientPocketMember[]>([]);
  const dispatch = createEventDispatcher();

  $: pending = $members.filter((m) => m.status === 'pending');
  $: banned = $members.filter((m) => m.status === 'banned');
  $: joined = $members.filter((m) => m.status === 'joined');

  const reload = async () => {
    const req = await PocketMemberListRequest.get(pocket_id);

    if (req.success) {
      members.update(() => {
        return req.members;
      });

      dispatch('count', req.members.length);
    }
  };

  onMount(reload);

  onDestroy(() => {
    $members = [];
  });
</script>

<div data-flex="v" data-gap="1">
  {#if joined_only === false && pending.length}
    <div>
      <Row bordered padded>
        <h2 slot="left">Waiting to join</h2>
      </Row>
      <ul data-unstyle data-flex="v">
        {#if pending.length === 0}
          <li class="h3 half" data-padded>
            Nothing here… <span class="half">yet<em>!</em></span>
          </li>
        {/if}
        {#each pending as member (member)}
          <slot {member} {reload} />
        {/each}
      </ul>
    </div>
  {/if}
  <div>
    <Row bordered padded>
      <h2 slot="left">Joined</h2>
    </Row>
    <ul data-unstyle data-flex="v">
      {#if joined.length === 0}
        <li class="h3 half" data-padded>
          Nothing here… <span class="half">yet<em>!</em></span>
        </li>
      {/if}
      {#each joined as member (member)}
        <slot {member} {reload} />
      {/each}
    </ul>
  </div>
  {#if joined_only === false && banned.length}
    <div>
      <Row bordered padded>
        <h2 slot="left">Blocked</h2>
      </Row>
      <ul data-unstyle data-flex="v">
        {#if banned.length === 0}
          <li class="h3 half" data-padded>
            Nothing here… <span class="half">yet<em>!</em></span>
          </li>
        {/if}
        {#each banned as member (member)}
          <slot {member} {reload} />
        {/each}
      </ul>
    </div>
  {/if}
</div>
