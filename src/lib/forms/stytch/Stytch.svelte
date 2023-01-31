<script lang="ts">
  import { writable } from 'svelte/store';
  import PhoneNumber from './ui/PhoneNumber.svelte';
  import SecretCode from './ui/SecretCode.svelte';
  import { slide } from 'svelte/transition';
  import { createEventDispatcher, setContext } from 'svelte';
  import { type StytchContext, STYTCH_CONTEXT_ID } from '$lib/contexts/Stytch';

  const dispatch = createEventDispatcher();
  const context = setContext<StytchContext>(
    STYTCH_CONTEXT_ID,
    writable('challenge')
  );

  let method_id: string | undefined;

  const challengeComplete = (e: CustomEvent<{ method_id: string }>) => {
    method_id = e.detail.method_id;
    $context = 'verify';
  };

  const verifyComplete = async () => {
    dispatch('complete');
  };
</script>

{#if $context === 'challenge'}
  <div in:slide|local={{ delay: 250 }} out:slide|local>
    <PhoneNumber on:complete={challengeComplete} />
  </div>
{/if}

{#if $context === 'verify'}
  <div in:slide|local={{ delay: 250 }} out:slide|local>
    <SecretCode {method_id} on:complete={verifyComplete} />
  </div>
{/if}
