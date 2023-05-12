<script lang="ts">
  import Button from '$lib/components/Button.svelte';
  import Container from '$lib/components/Container.svelte';
  import { createEventDispatcher } from 'svelte';
  import { writable } from 'svelte/store';
  import { trackGoal } from 'fathom-client';
  import { page } from '$app/stores';

  const dispatch = createEventDispatcher();

  const loading = writable(false);

  const subscribeClick = () => {
    $loading = true;
    trackGoal('ZOOQK7CR', 1);
  };

  const noThanksClick = () => {
    dispatch('complete');
  };
</script>

<div data-flex="v" data-gap="1">
  <div data-flex="v" data-gap="1">
    <Container rounded fill="system-superlight">
      <h2>We're building a safe place online, for everyone in our communities.</h2>
      <h3 class="half">
        So we can hang out more often, show up for each other when it matters, and
        share our creativity in a whole new way.
      </h3>
    </Container>
    <Container>
      <div data-flex="v as" data-gap>
        <h2>On Pocketrides, 500 likes is $5.00 in your actual pocket.</h2>
        <p>
          Every month, subscribers have 250 likes to give out to great content on
          Pocketrides, and we'd encourage you to consider subscribing.
        </p>
        <p>
          Taking care of each other and where we live, in small ways every day, is
          how we build a thriving world that works for everyone.
        </p>
      </div>
    </Container>
  </div>
  {#if $page.data.my_nametag}
    <div data-ph data-flex="v cc" data-gap="1">
      <Button
        label={$loading ? 'Sending you to Stripe…' : 'Subscribe for $5/mo'}
        disabled={$loading}
        href="/_/stripe/pay"
        on:click={subscribeClick}
        primary
        xlarge
      />
      <Button label="No thanks!" on:click={noThanksClick} />
    </div>
  {:else}
    <div data-flex="v cc">
      <Button label="Got it!" on:click={noThanksClick} />
    </div>
  {/if}
</div>
