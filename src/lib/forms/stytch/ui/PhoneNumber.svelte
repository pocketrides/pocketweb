<script lang="ts">
  import { StytchChallenge } from '$lib/api/stytch/challenge';
  import Button from '$lib/components/Button.svelte';
  import ButtonRow from '$lib/components/ButtonRow.svelte';
  import Container from '$lib/components/Container.svelte';
  import Icon from '$lib/components/Icon.svelte';
  import Select from '$lib/components/Select.svelte';
  import { type SheetContext, SHEET_CONTEXT_ID } from '$lib/contexts/Sheet';
  import { App } from '$lib/stores/app';
  import { HomepageHelper } from '$lib/util/homepage';
  import { is_standalone } from '$lib/util/is-standalone';
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
  <div data-flex="v as" data-gap="1">
    {#if is_standalone === false && HomepageHelper.isHomepagePath()}
      <div data-ph data-flex="v as">
        <div data-flex="v as" data-error data-fill="superdark">
          <p class="small">Get the app:</p>
          <a
            href="#app"
            class="small h3"
            on:click|preventDefault={() => {
              $App.sheet_id = 'app_help';
            }}>Add to Home Screen</a
          >
        </div>
      </div>
    {/if}
    <div data-flex="v as" data-gap>
      <label class="h2" for="phone">Sign in with your phone number:</label>
      <ButtonRow>
        <Select bind:value={regionCode} autocomplete="tel-country-code" collapse>
          {#each AVAILABLE_COUNTRIES as country}
            <option value={country.value}>{country.display}</option>
          {/each}
        </Select>
        <input
          id="phone"
          autocomplete="tel-national"
          type="tel"
          inputmode="tel"
          bind:value={phoneNumber}
          data-3d
          class="h3"
          class:filled={valid}
          name="phone"
        />
      </ButtonRow>
      {#if valid === false && phoneNumber !== ''}
        <label for="phone" data-error>That doesn't look like a valid number!</label>
      {/if}
      {#if $has_error}
        <label for="phone" data-error>Something went wrong! Try again.</label>
      {/if}
    </div>
  </div>
  <p class="half" data-ph>
    <small>
      <strong>We will never sell your number or spam you. Ever.</strong> By
      continuing, you agree to the platform
      <strong><a href="/privacy-policy" target="_blank"> Privacy Policy</a></strong>.
    </small>
  </p>
  <ButtonRow>
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
      large
    />
  </ButtonRow>
  <div data-ph>
    <Container rounded fill="system-superlight">
      <h3><Icon icon="help" /> No account? No problem!</h3>
      <p class="small">
        You'll set one up just by signing in. You don't set a password, we'll text
        you a new, random code every time you log in.
      </p>
    </Container>
  </div>
</form>
