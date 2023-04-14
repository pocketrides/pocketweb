<script lang="ts">
  import { StytchVerify } from '$lib/api/stytch/verify';
  import Button from '$lib/components/Button.svelte';
  import { createEventDispatcher, getContext } from 'svelte';
  import { writable } from 'svelte/store';
  import { secret_code_validator } from '$lib/zod/Stytch';
  import { type SheetContext, SHEET_CONTEXT_ID } from '$lib/contexts/Sheet';
  import { STYTCH_CONTEXT_ID, type StytchContext } from '$lib/contexts/Stytch';

  const dispatch = createEventDispatcher();
  const submitting = writable(false);
  const api_error = writable(false);
  const context = getContext<SheetContext>(SHEET_CONTEXT_ID);
  const stytch_context = getContext<StytchContext>(STYTCH_CONTEXT_ID);

  $context.dismissable = false;

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
        dispatch('done');
      } else {
        $submitting = false;
        $api_error = true;
      }
    }
  };

  const startOverClick = () => {
    $stytch_context = 'challenge';
  };
</script>

<form data-flex="v" data-gap on:submit|preventDefault={handleSubmit}>
  <div>
    <h2>We sent you a secret code.</h2>
    <p>Enter it now to confirm it's really you.</p>
  </div>
  <div data-flex="v as" data-gap>
    <div data-flex="v as">
      <label class="h2" for="secret-code">Secret code:</label>
      <input
        id="secret-code"
        class="h3"
        autocomplete="one-time-code"
        bind:value={code}
        class:filled={valid}
        data-3d
      />
    </div>
    <p class="half small">
      Didn't get a code? <a
        href="#reset"
        class="h3 small"
        on:click|preventDefault={startOverClick}>Start over</a
      >.
    </p>
    {#if valid === false && code !== ''}
      <label for="secret-code" data-error>That doesn't look right.</label>
    {/if}
    {#if $api_error === true}
      <label for="secret-code" data-error data-flex="v as" data-gap>
        <p>Something went wrong.</p>
        <Button label="Start over" on:click={startOverClick} />
      </label>
    {/if}
  </div>
  <div data-flex data-gap>
    <Button
      type="submit"
      label={$submitting ? 'One sec!' : 'Continue…'}
      disabled={$submitting || !valid}
      system
    />
  </div>
</form>
