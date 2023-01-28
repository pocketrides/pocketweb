<script lang="ts">
  import Button from '$lib/components/Button.svelte';
  import { AVAILABLE_COUNTRIES } from '$lib/zod/Stytch';
  import { parsePhoneNumber } from 'awesome-phonenumber';
  import { afterUpdate, createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  let regionCode: string = AVAILABLE_COUNTRIES[0].value;
  let phoneNumber: string = '';
  let valid = false;

  export let e164: string | undefined;
  export let type: 'sms' | 'whatsapp' = 'sms';

  afterUpdate(() => {
    const parsed = parsePhoneNumber(phoneNumber, { regionCode });

    e164 = parsed.valid ? parsed.number.e164 : undefined;
    valid = e164 !== undefined;
  });

  const handleSubmit = async () => {
    if (!valid) return;
  };
</script>

<form on:submit|preventDefault={handleSubmit} data-flex="v" data-gap>
  <div data-flex="v">
    <label class="h2" for="phone">Phone number:</label>
    <div data-button-row>
      <select
        bind:value={regionCode}
        data-3d
        autocomplete="tel-country-code"
        class="filled h3"
      >
        {#each AVAILABLE_COUNTRIES as country}
          <option value={country.value}>{country.display}</option>
        {/each}
      </select>
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
  </div>
  <div data-flex data-gap>
    <Button
      type="submit"
      label="Send SMS"
      on:click={() => {
        type = 'sms';
      }}
      disabled={!valid}
      system={true}
    />
    <Button
      type="submit"
      label="Send WhatsApp"
      on:click={() => {
        type = 'whatsapp';
      }}
      disabled={!valid}
      system={true}
    />
  </div>
</form>

<style lang="scss">
  select {
    text-align: center;
  }
</style>
