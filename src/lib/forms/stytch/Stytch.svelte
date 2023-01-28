<script lang="ts">
  import { writable } from 'svelte/store';
  import PhoneNumber from './ui/PhoneNumber.svelte';
  import SecretCode from './ui/SecretCode.svelte';
  import { slide } from 'svelte/transition';

  const stage = writable<'challenge' | 'verify'>('challenge');
  let method_id: string | undefined;

  const challengeComplete = (e: CustomEvent<{ method_id: string }>) => {
    method_id = e.detail.method_id;
    console.log('> got method_id', method_id);
    $stage = 'verify';
  };

  const verifyComplete = async () => {
    console.log('> verifyComplete');
  };
</script>

{#if $stage === 'challenge'}
  <div out:slide|local>
    <PhoneNumber on:complete={challengeComplete} />
  </div>
{/if}

{#if $stage === 'verify'}
  <div in:slide|local={{ delay: 250 }} out:slide|local>
    <SecretCode {method_id} on:complete={verifyComplete} />
  </div>
{/if}
