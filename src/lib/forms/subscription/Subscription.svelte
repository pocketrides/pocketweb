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
  <div data-flex="v" data-gap>
    <Container rounded fill="system-superlight">
      <h2>
        We're building a safe place online, for everyone in our communities.
        <h2 class="half">
          So we can hang out more, show up for each other when it matters, and share
          our creativity in a whole new way.
        </h2>
      </h2>
    </Container>
    <Container>
      <div data-flex="v" data-gap>
        <p>
          <strong>Unfortunately, social media is here to stay.</strong> Our contribution
          to everyone doing the hard work of organizing, creating, and curating? On Pocketrides,
          the like button earns you a cent.
        </p>
        <p>
          Earning money from what you share online creates a great incentive for
          everyone on Pocketrides to post thoughtful, quality content. (And having a
          new way to make money from the time you put into your side project, hobby,
          or organization sounds awesome.)
        </p>
        <h2>On Pocketrides, 500 likes is $5.00 in your actual pocket.</h2>
        <p>
          Only subscribers can give out likes (a cent at a time, of course), and we'd
          encourage you to consider subscribing: taking care of each other and where
          we live, in small ways every day, is how we build a thriving world that
          works for everyone.
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
