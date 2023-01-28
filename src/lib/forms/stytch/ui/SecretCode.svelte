<script lang="ts">
  import { StytchVerify } from '$lib/api/stytch/verify';
  import Button from '$lib/components/Button.svelte';
  import { createEventDispatcher } from 'svelte';
  import { writable } from 'svelte/store';
  import { secret_code_validator } from '$lib/zod/Stytch';

  const dispatch = createEventDispatcher();
  const submitting = writable(false);

  export let method_id: string | undefined;

  let code: string = '';

  $: valid = secret_code_validator.safeParse(code).success;

  const handleSubmit = async () => {
    if (valid && code && method_id) {
      $submitting = true;

      const res = await StytchVerify.post({
        method_id,
        code
      });

      if (res.success) {
        dispatch('complete');
      } else {
        $submitting = false;
      }
    }
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
    <Button
      type="submit"
      label={$submitting ? 'One sec!' : 'Continue…'}
      disabled={$submitting || !valid}
      system={true}
    />
  </div>
</form>
