<script lang="ts">
  import Button from '$lib/components/Button.svelte';
  import { createEventDispatcher } from 'svelte';
  import { z } from 'zod';

  const dispatch = createEventDispatcher();

  export let code: string = '';
  const validator = z.string().regex(/(^\d{6}$)/g);

  $: valid = validator.safeParse(code).success;

  const handleSubmit = () => {
    dispatch('submit');
  };
</script>

<form data-flex="v" data-gap on:submit|preventDefault={handleSubmit}>
  <div data-flex="v">
    <label class="h2" for="secret-code">Secret code:</label>
    <input
      id="secret-code"
      class="h3"
      autocomplete="one-time-code"
      bind:value={code}
      class:filled={valid}
      data-3d
    />
    {#if valid === false && code !== ''}
      <label for="secret-code" data-error>That doesn't look right.</label>
    {/if}
  </div>
  <div data-flex data-gap>
    <Button type="submit" label="Continue…" system={true} disabled={!valid} />
  </div>
</form>
