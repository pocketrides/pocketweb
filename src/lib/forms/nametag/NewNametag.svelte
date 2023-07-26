<script lang="ts">
  import { NametagCreate } from '$lib/api/nametag/create';
  import Button from '$lib/components/Button.svelte';
  import Nametag from '$lib/components/Nametag.svelte';
  import Select from '$lib/components/Select.svelte';
  import { draft_nametag_validator } from '$lib/zod/Nametag';
  import { THEME_NAMES, THEME_VALUES, type ThemeValue } from '$lib/zod/Theme';
  import { createEventDispatcher } from 'svelte';
  import { writable } from 'svelte/store';
  import { slide } from 'svelte/transition';
  import NametagAnim from './NametagAnim.svelte';

  let nametag: string = '';
  let theme: ThemeValue | '' = '';

  $: valid = draft_nametag_validator.safeParse({ nametag, theme }).success;

  const dispatch = createEventDispatcher();
  const submitting = writable(false);
  const error = writable(false);

  const handleSubmit = async () => {
    if (!valid || theme === '') return;

    $error = false;
    $submitting = true;

    const result = await NametagCreate.post({ nametag, theme });

    if (result.success === true) {
      dispatch('complete', { first_time: true, nametag_id: result.nametag_id });
    } else {
      $submitting = false;
      $error = true;
    }
  };
</script>

<form
  on:submit|preventDefault={handleSubmit}
  data-flex="v"
  data-gap
  data-theme={theme}
>
  <NametagAnim>
    {#if nametag !== ''}
      <div
        class="preview"
        data-flex="v cc"
        data-gap
        data-fill={theme === '' ? 'system-light' : 'light'}
        in:slide
        out:slide
      >
        <Nametag
          large
          nametag={{ nametag, theme: theme === '' ? undefined : theme }}
          on:click={(e) => {
            e.preventDefault();
          }}
        />
        {#if theme === ''}
          <p class="half">Add some color, pick a theme!</p>
        {:else}
          <p class="h3">It's you! <span class="half">Gorgeous!</span></p>
        {/if}
      </div>
    {/if}
  </NametagAnim>
  <div data-flex data-gap>
    <div data-flex="v">
      <label for="nametag" class="h3">Nametag:</label>
      <input
        type="text"
        bind:value={nametag}
        class:filled={nametag !== ''}
        data-3d
        class="h3"
      />
    </div>

    <div data-flex="v">
      <label for="theme" class="h3">Theme:</label>
      <Select id="theme" bind:value={theme}>
        <option value="">Pick!</option>
        {#each THEME_NAMES as name, i}
          <option value={THEME_VALUES[i]}>{name}</option>
        {/each}
      </Select>
    </div>
  </div>
  <div data-flex>
    <Button
      type="submit"
      primary
      large
      disabled={!valid || $submitting}
      label={$submitting ? 'One sec!' : 'Continue…'}
    />
  </div>
</form>

<style lang="scss">
  .preview {
    p {
      max-width: 140px;
      text-align: center;
    }
  }
</style>
