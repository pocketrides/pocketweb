<script lang="ts">
  import Button from '$lib/components/Button.svelte';
  import { upload } from '$lib/util/cloudinary';
  import { createEventDispatcher } from 'svelte';
  import { writable, type Writable } from 'svelte/store';

  export let controller: Writable<string>;

  let file_input: HTMLInputElement;
  let files: FileList;

  const dispatch = createEventDispatcher();

  const uploading = writable(false);
  const error = writable(false);

  const idle_status = `Processing…`;
  const error_status = `Try again.`;
  const done_status = `Done!`;
  const current_status = writable(idle_status);

  const handleChange = async () => {
    $error = false;
    $uploading = true;

    const photos = await upload(files, (current, total) => {
      $current_status = `Uploading ${current} of ${total}…`;
    });

    if (photos) {
      $current_status = done_status;
      dispatch('uploaded', photos);

      setTimeout(() => {
        $uploading = false;
        $current_status = idle_status;
      }, 1500);
    } else {
      $current_status = error_status;
      $error = true;
      $uploading = false;
    }

    file_input.value = '';
  };
</script>

<div data-3d-container>
  {#if $controller === 'add_pics'}
    <input
      type="file"
      accept="image/*"
      multiple
      data-sham
      disabled={$uploading}
      bind:this={file_input}
      bind:files
      on:change={handleChange}
    />
  {/if}
  {#if $uploading}
    <Button
      disabled
      icon="autorenew"
      icon_spins={$current_status !== done_status}
      label={$current_status}
    />
  {:else}
    <Button
      id="add_pics"
      label={$error ? $current_status : 'Add pics'}
      icon="add_photo_alternate"
      {controller}
      disabled={$uploading}
    />
  {/if}
</div>
