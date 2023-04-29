<script lang="ts">
  import { StytchVerify } from '$lib/api/stytch/verify';
  import Button from '$lib/components/Button.svelte';
  import { createEventDispatcher, getContext } from 'svelte';
  import { writable } from 'svelte/store';
  import { secret_code_validator } from '$lib/zod/Stytch';
  import { type SheetContext, SHEET_CONTEXT_ID } from '$lib/contexts/Sheet';
  import { STYTCH_CONTEXT_ID, type StytchContext } from '$lib/contexts/Stytch';
  import Container from '$lib/components/Container.svelte';

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

<form data-flex="v" data-gap="1" on:submit|preventDefault={handleSubmit}>
  <Container rounded fill="system-superlight">
    <div>
      <h3>We sent you a verification code.</h3>
      <p>Enter it below to confirm your identity.</p>
    </div>
  </Container>
  <div data-flex="v as" data-gap>
    <h2>Verification code</h2>
    <div data-flex="v as">
      <label class="h3" for="secret-code">Enter the six-digit code:</label>
      <input
        id="secret-code"
        class="h3"
        autocomplete="one-time-code"
        bind:value={code}
        class:filled={valid}
        data-3d
      />
    </div>

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
  <div data-flex="v as" data-gap data-ph>
    <p class="half small">
      Didn't get a message? <a
        href="#reset"
        class="h3 small"
        on:click|preventDefault={startOverClick}>Start over</a
      >.
    </p>
    <Button
      type="submit"
      label={$submitting ? 'One sec!' : 'Continue…'}
      disabled={$submitting || !valid}
      system
    />
  </div>
</form>
