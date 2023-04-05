<script lang="ts">
  import { page } from '$app/stores';
  import Button from '$lib/components/Button.svelte';
  import Container from '$lib/components/Container.svelte';
  import NametagWithPic from '$lib/components/NametagWithPic.svelte';
  import Row from '$lib/components/Row.svelte';
  import Sheet from '$lib/components/Sheet.svelte';
  import FriendsList from '$lib/forms/nametag/FriendsList.svelte';
  import type { ClientNametag } from '$lib/zod/Nametag';
  import { POCKET_MAX_COHOSTS, type DraftPocket } from '$lib/zod/Pocket';
  import type { Writable } from 'svelte/store';

  export let page_controller: Writable<DraftPocket>;

  $: exclude_ids = $page_controller.hosts.map((h) => h.id);
  $: can_add_more = $page_controller.hosts.length <= POCKET_MAX_COHOSTS;

  const addCohost = (nametag: ClientNametag) => {
    page_controller.update((prev) => {
      prev.hosts.push(nametag);
      return prev;
    });
  };

  const removeCohost = (nametag: ClientNametag) => {
    page_controller.update((prev) => {
      const cohost_index = prev.hosts.findIndex((n) => n === nametag);
      prev.hosts.splice(cohost_index, 1);

      return prev;
    });
  };
</script>

<Sheet
  id="pocket_cohosts"
  header="Cohosts"
  icon="campaign"
  padded={false}
  close="Done"
>
  <div data-flex="v" data-gap data-padded>
    <Container padded rounded bordered fill="system-superlight">
      <div data-flex="v" data-gap>
        <h2>Manage your pocket with friends.</h2>
        <p class="h3">
          We're on a mission to make managing your group comms easier and less
          time-consuming than ever.
        </p>
        <p>
          With Cohosts, it's a snap to add your friends to help out with admin duties
          of your pocket.
        </p>
        <p>They'll get a nice call-out on the pocket, for transparency's sake.</p>
      </div>
    </Container>
  </div>
  {#if $page.data.my_nametag?.id}
    {#if $page_controller.hosts.length}
      <div data-padded>
        <h2>Cohosts</h2>
      </div>
      <ul data-unstyle>
        {#each $page_controller.hosts as host (host)}
          {#if $page.data.my_nametag?.id !== host.id}
            <li>
              <Row fill="system-superlight" padded bordered>
                <NametagWithPic slot="left" nametag={host} />
                <Button
                  slot="right"
                  label="Remove"
                  on:click={() => {
                    removeCohost(host);
                  }}
                />
              </Row>
            </li>
          {/if}
        {/each}
      </ul>
      {#if !can_add_more}
        <p data-padded class="h3">That's all you can add.</p>
      {/if}
    {/if}
    <div data-padded>
      <h2>Add friends</h2>
      <p>You can only add friends as cohosts.</p>
    </div>
    <FriendsList
      flex="v"
      gap={false}
      padded
      friends_for={$page.data.my_nametag.id}
      {exclude_ids}
      let:nametag
    >
      <Row fill="system-superlight" padded bordered>
        <NametagWithPic slot="left" {nametag} />
        <div slot="right">
          {#if can_add_more}
            <Button
              label="Add"
              on:click={() => {
                addCohost(nametag);
              }}
            />
          {/if}
        </div>
      </Row>
    </FriendsList>
  {/if}
</Sheet>
