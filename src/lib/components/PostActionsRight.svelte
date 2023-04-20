<script lang="ts">
  import type { ServerPost } from '$lib/zod/Post';
  import { writable, type Writable } from 'svelte/store';
  import Button from './Button.svelte';
  import ButtonRow from './ButtonRow.svelte';
  import { page } from '$app/stores';
  import { goto, invalidateAll } from '$app/navigation';
  import { DeletePostRequest } from '$lib/api/post/delete';

  export let post_controller: Writable<ServerPost | undefined>;
  export let button_controller: Writable<string>;
  export let showing_post: Writable<boolean>;
  export let is_quarantining: Writable<boolean>;
  export let quarantineClick: () => void;

  let selected_action: 'edit' | 'delete' | '' = '';

  const more_in_prog = writable(false);

  const handlePostActionChange = async () => {
    if (selected_action === 'edit' && $post_controller) {
      const qs = new URLSearchParams();
      qs.append('edit', $post_controller.id);

      if ($post_controller.pocket_ref) {
        qs.append('pocket', $post_controller.pocket_ref.id);
      }
      $more_in_prog = true;
      goto(`/post?${qs.toString()}`);
    }

    if (selected_action === 'delete') {
      if (
        confirm(
          `You better be sure you wanna delete this 'cause it's gone if you click OK.`
        ) &&
        $post_controller
      ) {
        $more_in_prog = true;
        const success = await DeletePostRequest.delete($post_controller.id);
        if (success) {
          location.reload();
        } else {
          alert('Try again.');
          $more_in_prog = false;
        }
      }
    }

    selected_action = '';
  };
</script>

{#if $post_controller && $post_controller.stats}
  <ButtonRow>
    {#if $post_controller.is_quarantined}
      <Button
        controller={button_controller}
        small
        id="hide"
        icon="visibility_off"
        label="Hide post"
        on:click={() => {
          $showing_post = false;
        }}
      />
    {/if}
    {#if $page.data.my_nametag?.id === $post_controller.nametag.id}
      <div data-3d-container>
        <select
          data-sham
          bind:value={selected_action}
          on:change={handlePostActionChange}
        >
          <option disabled selected value="">Actions:</option>
          <option value="edit">Edit post</option>
          <option value="delete">Delete post</option>
        </select>
        <Button
          icon={$more_in_prog ? 'refresh' : 'more_horiz'}
          icon_spins={$more_in_prog}
          disabled={$more_in_prog}
          label=""
        />
      </div>
    {/if}
    <Button
      id="quarantines"
      icon="support"
      small
      disabled={$is_quarantining}
      controller={button_controller}
      count={$post_controller.stats.quarantines}
      primary={$post_controller.is_quarantined}
      label={$post_controller.is_quarantined ? 'Unquarantine' : 'Quarantine'}
      on:click={quarantineClick}
    />
  </ButtonRow>
{/if}
