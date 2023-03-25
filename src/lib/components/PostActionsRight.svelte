<script lang="ts">
  import type { ServerPost } from '$lib/zod/Post';
  import type { Writable } from 'svelte/store';
  import Button from './Button.svelte';
  import ButtonRow from './ButtonRow.svelte';

  export let post_controller: Writable<ServerPost | undefined>;
  export let button_controller: Writable<string>;
  export let showing_post: Writable<boolean>;
  export let is_quarantining: Writable<boolean>;
  export let quarantineClick: () => void;
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
