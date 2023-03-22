<script lang="ts">
  import { invalidateAll } from '$app/navigation';
  import { NametagUpdate } from '$lib/api/nametag/update';
  import Icon from '$lib/components/Icon.svelte';
  import { upload } from '$lib/util/cloudinary';
  import type { CloudinaryPhoto } from '$lib/zod/CloudinaryPhoto';
  import { writable } from 'svelte/store';
  import ProfilePic from './ProfilePic.svelte';

  export let profile_pic: CloudinaryPhoto | undefined;

  const uploading = writable(false);
  const error = writable(false);
  let files: FileList;

  const handleChange = async () => {
    $uploading = true;

    const uploaded = await upload(files);

    if (uploaded) {
      $error = false;

      await NametagUpdate.post({
        profile_pic: uploaded[0]
      });

      profile_pic = uploaded[0];

      $uploading = false;
      await invalidateAll();
    } else {
      $error = true;
      $uploading = false;
      profile_pic = undefined;
    }
  };
</script>

<div class="wrapper">
  <input
    data-sham
    type="file"
    bind:files
    accept="image/*"
    on:change={handleChange}
  />
  {#if !$uploading}
    <ProfilePic {profile_pic} />
  {/if}
  {#if !profile_pic || $uploading}
    <div class="cta" data-3d aria-disabled={$uploading} data-flex="cc">
      <div data-flex="v" class:half={$uploading}>
        <div class="h1 half" data-flex="cc"><Icon icon="face" /></div>
        <p class="h3 half">
          {#if $uploading}
            Uploading…
          {:else if $error}
            Try again
          {:else}
            Upload pic
          {/if}
        </p>
      </div>
    </div>
  {/if}
</div>

<style lang="scss">
  .wrapper {
    flex: 1;
    aspect-ratio: 1/1;
    max-width: 140px;
  }

  .cta {
    height: 100%;
  }
</style>
