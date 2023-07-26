<script lang="ts">
  import { AddCloseFriendRequest } from '$lib/api/relationships/add_close_friend';
  import { BlockRequest } from '$lib/api/relationships/block';
  import { FollowRequest } from '$lib/api/relationships/follow';
  import { RemoveCloseFriendRequest } from '$lib/api/relationships/remove_close_friend';
  import { UnblockRequest } from '$lib/api/relationships/unblock';
  import { UnfollowRequest } from '$lib/api/relationships/unfollow';
  import Button from '$lib/components/Button.svelte';
  import ButtonRow from '$lib/components/ButtonRow.svelte';
  import { writable, type Writable } from 'svelte/store';
  import type { LayoutData } from '../$types';

  export let page_controller: Writable<LayoutData>;

  const controller: Writable<string> = writable('follow');

  const followClick = async () => {
    $page_controller.relationship.is_following = true;
    $page_controller.page_nametag_stats.followers += 1;
    $controller = 'add_close_friend';

    await FollowRequest.post({
      target_nametag_id: $page_controller.page_nametag.id
    });
  };

  const unfollowClick = async () => {
    $page_controller.relationship.is_following = false;
    $page_controller.relationship.is_close_friend = false;
    $page_controller.page_nametag_stats.followers -= 1;
    $controller = 'follow';

    await UnfollowRequest.post({
      target_nametag_id: $page_controller.page_nametag.id
    });
  };

  const blockClick = async () => {
    if ($page_controller.relationship.is_following) {
      $page_controller.page_nametag_stats.followers -= 1;
    }

    $page_controller.relationship.is_blocking = true;
    $page_controller.relationship.is_following = false;
    $page_controller.relationship.is_close_friend = false;
    $controller = 'unblock';

    await BlockRequest.post({
      target_nametag_id: $page_controller.page_nametag.id
    });
  };

  const unblockClick = async () => {
    $page_controller.relationship.is_blocking = false;
    $controller = 'follow';

    await UnblockRequest.post({
      target_nametag_id: $page_controller.page_nametag.id
    });
  };

  const addToCloseFriendsClick = async () => {
    $page_controller.relationship.is_close_friend = true;
    $controller = '';

    await AddCloseFriendRequest.post({
      target_nametag_id: $page_controller.page_nametag.id
    });
  };

  const removeFromCloseFriendsClick = async () => {
    $page_controller.relationship.is_close_friend = false;
    $controller = 'add_close_friend';

    await RemoveCloseFriendRequest.post({
      target_nametag_id: $page_controller.page_nametag.id
    });
  };
</script>

<ButtonRow initial={$controller}>
  {#if !$page_controller.is_my_profile_page}
    {#if $page_controller.relationship.is_blocking}
      <Button
        {controller}
        id="unblock"
        label="Unblock"
        icon="block"
        on:click={unblockClick}
      />
    {:else if $page_controller.relationship.is_following === false}
      <Button
        {controller}
        id="follow"
        label="Follow"
        icon="person_add"
        on:click={followClick}
      />
    {:else}
      {#if $page_controller.relationship.is_close_friend}
        <Button
          {controller}
          id="remove_close_friend"
          label="Remove close friend"
          icon="heart_broken"
          on:click={removeFromCloseFriendsClick}
          primary
        />
      {:else}
        <Button
          {controller}
          id="add_close_friend"
          label="Add close friend"
          icon="favorite_border"
          on:click={addToCloseFriendsClick}
        />
      {/if}
      <Button
        {controller}
        id="unfollow"
        label="Unfollow"
        icon="person_remove"
        on:click={unfollowClick}
      />
    {/if}
    {#if !$page_controller.relationship.is_blocking}
      <Button
        {controller}
        id="block"
        label="Block"
        icon="block"
        on:click={blockClick}
      />
    {/if}
  {/if}

  <Button
    id="share"
    label="Share"
    icon="ios_share"
    {controller}
    on:click={() => {
      try {
        navigator.share({
          url: window.location.toString()
        });
        controller.update(() => '');
      } catch (e) {
        return;
      }
    }}
  />

  {#if $page_controller.is_my_profile_page}
    <Button href="/settings" label="Settings" icon="settings_suggest" {controller} />
  {/if}
</ButtonRow>
