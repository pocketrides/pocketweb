<script lang="ts">
  import Button from '$lib/components/Button.svelte';
  import { upload } from '$lib/util/cloudinary';
  import type { CloudinaryPhoto } from '$lib/zod/CloudinaryPhoto';
  import { createEventDispatcher } from 'svelte';
  import { writable, type Writable } from 'svelte/store';

  export let controller: Writable<string>;
  export let label: string = 'Add pics';

  let file_input: HTMLInputElement;

  const dispatch = createEventDispatcher();

  const uploading = writable(false);
  const error = writable(false);

  const idle_status = `Processing…`;
  const error_status = `Try again.`;
  const done_status = `Done!`;
  const current_status = writable(idle_status);

  const handleChange = async () => {
    if (!file_input) return;
    if (!file_input.files?.length) return;

    $error = false;
    $uploading = true;

    const photos = await upload(file_input.files, (current, total) => {
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

    if (file_input) file_input.value = '';
  };

  const testValid = () => {
    dispatch('uploaded', [
      {
        public_id: 'Y9bSrRZTjCkcZz2so6Ofd',
        version: 1680545132,
        aws_rek_status: 'approved',
        alt_text: ''
      },
      {
        public_id: 'W4-yXrMGctYVG0fwtmvmA',
        version: 1680543327,
        aws_rek_status: 'approved',
        alt_text: ''
      }
    ] as CloudinaryPhoto[]);
  };

  const testRejection = () => {
    dispatch('uploaded', [
      {
        public_id: 'nQinLZtTrOe5SKr49ixHw',
        version: 1679526532,
        aws_rek_status: 'rejected',
        alt_text: ''
      }
    ] as CloudinaryPhoto[]);
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
      label={$error ? $current_status : label}
      icon={$error ? 'sentiment_very_dissatisfied' : 'add_photo_alternate'}
      {controller}
      disabled={$uploading}
    />
  {/if}
</div>
