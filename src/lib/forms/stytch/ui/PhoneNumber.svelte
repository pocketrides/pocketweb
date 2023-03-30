<script lang="ts">
  import { StytchChallenge } from '$lib/api/stytch/challenge';
  import Button from '$lib/components/Button.svelte';
  import Select from '$lib/components/Select.svelte';
  import { type SheetContext, SHEET_CONTEXT_ID } from '$lib/contexts/Sheet';
  import { AVAILABLE_COUNTRIES } from '$lib/zod/Stytch';
  import { parsePhoneNumber } from 'awesome-phonenumber';
  import { afterUpdate, createEventDispatcher, getContext, onMount } from 'svelte';
  import { writable } from 'svelte/store';

  const dispatch = createEventDispatcher();
  const submitting = writable(false);
  const has_error = writable(false);
  const context = getContext<SheetContext>(SHEET_CONTEXT_ID);

  let regionCode: string = AVAILABLE_COUNTRIES[0].value;
  let phoneNumber: string = '';
  let valid = false;

  let e164: string | undefined;
  let type: 'sms' | 'whatsapp' = 'sms';

  onMount(() => {
    $context.icon = 'hail';
    $context.header = 'Hello!';
  });

  afterUpdate(() => {
    const parsed = parsePhoneNumber(phoneNumber, { regionCode });

    e164 = parsed.valid ? parsed.number.e164 : undefined;
    valid = e164 !== undefined;
  });

  const handleSubmit = async (e: any) => {
    if (valid && e164) {
      $submitting = true;

      const res = await StytchChallenge.post({
        phone_number: e164,
        challenge_type: type
      });

      if (res.success) {
        dispatch('done', { method_id: res.method_id });
      } else {
        $submitting = false;
        $has_error = true;
      }
    }
  };
</script>

<form on:submit|preventDefault={handleSubmit} data-flex="v" data-gap>
  <div data-flex="v" data-gap>
    <h2>Welcome to Pocketrides!</h2>
    <p>
      <strong>We're doing social media a little differently:</strong> no ads, no algorithms,
      just you, your friends and a like button that earns you cash.
    </p>
    <p>Use your phone number to get a free account.</p>
  </div>

  <div data-flex="v as">
    <label class="h2" for="phone">Phone number:</label>
    <div data-button-row>
      <Select bind:value={regionCode} autocomplete="tel-country-code" collapse>
        {#each AVAILABLE_COUNTRIES as country}
          <option value={country.value}>{country.display}</option>
        {/each}
      </Select>
      <input
        id="phone"
        autocomplete="tel-national"
        bind:value={phoneNumber}
        data-3d
        class="h3"
        class:filled={valid}
      />
    </div>
    {#if valid === false && phoneNumber !== ''}
      <label for="phone" data-error>That doesn't look like a valid number!</label>
    {/if}
    {#if $has_error}
      <label for="phone" data-error>Something went wrong! Try again.</label>
    {/if}
  </div>
  <p class="half">
    <small>
      By continuing, you agree to the Pocketrides
      <strong><a href="/privacy-policy" target="_blank">Privacy Policy</a></strong>.
    </small>
  </p>
  <div data-flex data-gap>
    <Button
      type="submit"
      label={$submitting && type === 'sms' ? 'One sec!' : 'Send SMS'}
      on:click={() => {
        type = 'sms';
      }}
      disabled={!valid || $submitting}
      system
    />
    <Button
      type="submit"
      label={$submitting && type === 'whatsapp' ? 'One sec!' : 'Send WhatsApp'}
      on:click={() => {
        type = 'whatsapp';
      }}
      disabled={$submitting || !valid}
      system
    />
  </div>
</form>
