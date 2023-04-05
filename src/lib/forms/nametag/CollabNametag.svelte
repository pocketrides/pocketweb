<script lang="ts">
  import { page } from '$app/stores';
  import Container from '$lib/components/Container.svelte';
  import Row from '$lib/components/Row.svelte';
  import { onDestroy, onMount } from 'svelte';
  import FriendsList from './FriendsList.svelte';
  import Button from '$lib/components/Button.svelte';
  import NametagWithPic from '$lib/components/NametagWithPic.svelte';
  import { writable } from 'svelte/store';
  import {
    NametagCollabListRequest,
    type NametagCollabListResponse
  } from '$lib/api/nametag/collab/list';
  import type { ClientNametagCollab } from '$lib/zod/NametagCollab';
  import { NametagCollabRemoveRequest } from '$lib/api/nametag/collab/remove';
  import { NametagCollabAddRequest } from '$lib/api/nametag/collab/add';
  import type { ClientNametag } from '$lib/zod/Nametag';
  import { goto, invalidateAll } from '$app/navigation';

  const collabs = writable<NametagCollabListResponse | undefined>(undefined);
  let exclude_ids: string[] = [];

  const adding = writable('');
  const removing = writable('');
  const bye_bye = writable(false);

  onMount(async () => {
    await load();
  });

  onDestroy(() => {
    $collabs = undefined;
    exclude_ids = [];
  });

  const load = async () => {
    $collabs = await NametagCollabListRequest.list();

    if ($collabs.success && $collabs.collabs)
      exclude_ids = $collabs.collabs.map((c) => c.authorized_nametag.id);
  };

  const removeCollab = async (collab: ClientNametagCollab) => {
    $removing = collab.authorized_nametag.id;
    const res = await NametagCollabRemoveRequest.remove(
      collab.authorized_nametag.id
    );
    if (res.needs_reload === true) {
      $bye_bye = true;
      setTimeout(async () => {
        await invalidateAll();
        location.href = '/';
      }, 1000);
      return;
    }
    await load();
    $removing = '';
  };

  const addCollab = async (nametag: ClientNametag) => {
    $adding = nametag.id;
    await NametagCollabAddRequest.add(nametag.id);
    await load();
    $adding = '';
  };
</script>

<div data-flex="v">
  <div data-padded>
    <Container rounded bordered fill="system-superlight">
      <div data-flex="v as">
        <h2>What's Collab?</h2>
        <p>
          Nametag Collab is for larger accounts that want to manage their Nametag
          with friends, teammates, or coworkers.
        </p>
      </div>
    </Container>
  </div>
  {#if $collabs && $collabs.success && $collabs.collabs.length}
    <div data-padded>
      <h2>In the Collab</h2>
      <p>
        Friends can remove themselves at any time. They'll be prompted to select this
        Nametag each time they sign in.
      </p>
    </div>
    <ul data-flex="v" data-unstyle>
      {#each $collabs.collabs as collab (collab)}
        <li>
          <Row padded fill="superlight" bordered>
            <NametagWithPic slot="left" nametag={collab.authorized_nametag} />
            <Button
              slot="right"
              label={$bye_bye
                ? 'Bye-bye!'
                : $removing === collab.authorized_nametag.id
                ? 'Removing…'
                : 'Remove'}
              disabled={$removing === collab.authorized_nametag.id}
              on:click={() => {
                removeCollab(collab);
              }}
            />
          </Row>
        </li>
      {/each}
    </ul>
  {/if}
  <div data-padded>
    <h2>Add to Collab</h2>
    <p>You can only add friends to a collab.</p>
  </div>
  {#if $page.data.my_nametag?.id}
    <FriendsList
      friends_for={$page.data.my_nametag.id}
      let:nametag
      {exclude_ids}
      flex="v"
      padded
      gap={false}
    >
      <Row padded fill="system-superlight" bordered>
        <NametagWithPic slot="left" {nametag} />
        <Button
          slot="right"
          label={$adding === nametag.id ? 'Adding…' : 'Add'}
          disabled={$adding === nametag.id}
          on:click={() => {
            addCollab(nametag);
          }}
        />
      </Row>
    </FriendsList>
  {/if}
</div>
