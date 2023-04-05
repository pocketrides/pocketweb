<script lang="ts">
  import { invalidateAll } from '$app/navigation';
  import { page } from '$app/stores';
  import { NametagUpdate } from '$lib/api/nametag/update';
  import Button from '$lib/components/Button.svelte';
  import Select from '$lib/components/Select.svelte';
  import { App } from '$lib/stores/app';
  import { IDBCache } from '$lib/util/idb-cache';
  import { IDBFeedCache } from '$lib/util/idb-feed-cache';
  import { draft_nametag_validator } from '$lib/zod/Nametag';
  import { THEME_NAMES, THEME_VALUES } from '$lib/zod/Theme';
  import { writable } from 'svelte/store';

  const submitting = writable(false);

  let nametag = $page.data.my_nametag!.nametag;
  let theme = $page.data.my_nametag!.theme;
  let error = false;

  $: valid = draft_nametag_validator.safeParse({ nametag, theme }).success;

  const handleSubmit = async () => {
    $submitting = true;

    const res = await NametagUpdate.post({ nametag, theme });

    if (res.success) {
      await invalidateAll();
      await IDBFeedCache.clear();
      await IDBCache.clear();

      $App.sheet_id = '';
    } else {
      error = true;
    }

    $submitting = false;
  };
</script>

<form on:submit={handleSubmit} data-flex="v" data-gap="1" data-theme={theme}>
  <div data-flex="v as">
    <label for="nametag" class="h2">Nametag:</label>
    <input
      id="nametag"
      type="text"
      bind:value={nametag}
      class="h3"
      class:filled={nametag && nametag.length}
      data-3d
    />
  </div>
  <div data-flex="v as">
    <label for="theme" class="h2">Theme:</label>
    <Select id="theme" bind:value={theme}>
      {#if $page.data.my_nametag?.theme === 'system'}
        <option value="system">system</option>
      {/if}
      {#each THEME_NAMES as name, i}
        <option value={THEME_VALUES[i]}>{name}</option>
      {/each}
    </Select>
  </div>
  {#if error}
    <div data-flex="v as">
      <p data-error>Something went wrong, try again.</p>
    </div>
  {/if}
  <div data-flex>
    <Button
      type="submit"
      label={$submitting ? 'One sec!' : 'Save'}
      primary
      disabled={!valid || $submitting}
    />
  </div>
</form>
