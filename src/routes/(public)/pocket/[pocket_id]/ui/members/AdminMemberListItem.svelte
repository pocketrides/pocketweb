<script lang="ts">
  import { PocketMemberAdminAction } from '$lib/api/pocket/members/admin_actions';
  import Button from '$lib/components/Button.svelte';
  import ButtonRow from '$lib/components/ButtonRow.svelte';
  import NametagWithPic from '$lib/components/NametagWithPic.svelte';
  import Row from '$lib/components/Row.svelte';
  import type { ClientPocketMember } from '$lib/zod/PocketMember';
  import { createEventDispatcher } from 'svelte';
  import { writable } from 'svelte/store';

  export let member: ClientPocketMember;

  const member_store = writable<ClientPocketMember | undefined>(member);
  const dispatch = createEventDispatcher();

  $: $member_store = member;

  const admitting = writable(false);
  const deleting = writable(false);
  const blocking = writable(false);
  const unblocking = writable(false);

  const reload = () => {
    dispatch('reload');
  };

  const admitClick = async () => {
    if (!$member_store) return;

    $admitting = true;

    const res = await PocketMemberAdminAction.admit(
      $member_store.pocket_ref.id,
      $member_store.id
    );

    if (res.success) $member_store = res.member;

    $admitting = false;

    reload();
  };

  const deleteClick = async () => {
    if (!$member_store) return;
    if (!confirm('Are you sure?')) return;

    $deleting = true;

    const res = await PocketMemberAdminAction.delete(
      $member_store.pocket_ref.id,
      $member_store.id
    );

    if (res.success) $member_store = res.member;

    $deleting = false;

    reload();
  };

  const blockClick = async () => {
    if (!$member_store) return;
    $blocking = true;

    const res = await PocketMemberAdminAction.block(
      $member_store.pocket_ref.id,
      $member_store.id
    );

    if (res.success) $member_store = res.member;

    $blocking = false;

    reload();
  };

  const unblockClick = async () => {
    if (!$member_store) return;
    $unblocking = true;

    const res = await PocketMemberAdminAction.unblock(
      $member_store.pocket_ref.id,
      $member_store.id
    );

    if (res.success) $member_store = res.member;

    $unblocking = false;

    reload();
  };
</script>

{#if $member_store}
  <li data-padded>
    <Row>
      <div slot="left">
        <NametagWithPic nametag={$member_store.nametag} large />
      </div>
      <div slot="right">
        <ButtonRow
          let:controller
          initial={$member_store.status === 'pending' ? 'admit' : ''}
        >
          {#if $member_store.status === 'pending'}
            <Button
              id="admit"
              label={$admitting ? 'One sec!' : 'Admit'}
              disabled={$admitting}
              icon="check_circle"
              {controller}
              on:click={admitClick}
            />
            <Button
              id="deny"
              label={$deleting ? 'One sec!' : 'Delete'}
              disabled={$deleting}
              icon="delete"
              {controller}
              on:click={deleteClick}
            />
          {:else if $member_store.status !== 'banned'}
            <Button
              id="remove"
              label={$deleting ? 'One sec!' : 'Remove'}
              disabled={$deleting}
              icon="delete"
              {controller}
              on:click={deleteClick}
            />
          {/if}
          {#if $member_store.status === 'joined'}
            <Button
              id="block"
              label={$blocking ? 'One sec!' : 'Block'}
              disabled={$blocking}
              icon="block"
              {controller}
              on:click={blockClick}
            />
          {/if}
          {#if $member_store.status === 'banned'}
            <Button
              id="unblock"
              label={$unblocking ? 'One sec!' : 'Unblock'}
              disabled={$unblocking}
              icon="check_circle"
              {controller}
              on:click={unblockClick}
            />
          {/if}
        </ButtonRow>
      </div>
    </Row>
  </li>
{/if}
