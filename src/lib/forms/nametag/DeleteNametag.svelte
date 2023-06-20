<script lang="ts">
  import { page } from '$app/stores';
  import { NametagDeleteRequest } from '$lib/api/nametag/delete';
  import Button from '$lib/components/Button.svelte';
  import Container from '$lib/components/Container.svelte';
  import Icon from '$lib/components/Icon.svelte';
  import { App } from '$lib/stores/app';
  import { writable } from 'svelte/store';

  const deleting = writable(false);

  const deleteClick = async () => {
    if (
      confirm(`Last chance to bail out! Tap OK to permanently delete your Nametag.`)
    ) {
      $deleting = true;
      const res = await NametagDeleteRequest.post();
      if (res.success) location.href = '/';
      $deleting = false;
    }
  };
</script>

<div data-flex="v" data-gap="1">
  <Container rounded padded fill="system-superlight">
    <div data-flex="v" data-gap>
      <h2>Are you sure?</h2>
      <p class="h3">
        You don't need an active subscription to keep your profile on Pocketrides.
      </p>
      <p>
        This is permanent and takes effect immediately. Any in-progress Payouts will
        be lost forever.
      </p>
    </div>
  </Container>

  <div data-flex="vs" data-gap>
    <Button
      label={$deleting ? 'One sec!' : "I'm sure"}
      jumbo
      on:click={deleteClick}
      disabled={$deleting}
    />
    <Button
      label="Nevermind"
      primary
      jumbo
      on:click={() => {
        $App.sheet_id = '';
      }}
      disabled={$deleting}
    />
  </div>
</div>
