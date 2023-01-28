<script lang="ts">
  import { writable } from 'svelte/store';
  import PhoneNumber from './ui/PhoneNumber.svelte';
  import SecretCode from './ui/SecretCode.svelte';
  import { slide } from 'svelte/transition';

  const stage = writable<'challenge' | 'verify'>('challenge');

  let phone_number: string = '';
  let challenge_type: 'sms' | 'whatsapp' = 'sms';
  let secret_code: string = '';

  const handleChallenge = async () => {};

  const handleVerify = async () => {};
</script>

{#if $stage === 'challenge'}
  <div out:slide|local>
    <PhoneNumber
      bind:e164={phone_number}
      bind:type={challenge_type}
      on:submit={handleChallenge}
    />
  </div>
{/if}

{#if $stage === 'verify'}
  <div in:slide|local out:slide|local>
    <SecretCode bind:code={secret_code} on:submit={handleVerify} />
  </div>
{/if}
