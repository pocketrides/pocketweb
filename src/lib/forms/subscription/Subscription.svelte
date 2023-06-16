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
      <h2>An ethical social network.</h2>
      <p>
        We prioritize your mental health & wellbeing, not how many ads we can show
        you. <a href="/help" class="h3">Read our approach.</a>
      </p>
    </Container>
    <Container>
      <div data-flex="v as" data-gap>
        <h2>Likes earn cash.</h2>
        <p>
          Supporting each other in small ways is how we build a society that works
          for everyone. Subscribers have 250 likes each month to give out to great
          content on Pocketrides.
        </p>
      </div>
    </Container>
    <Container>
      <div data-flex="v as" data-gap>
        <h2>Profits to climate.</h2>
        <p>
          100% of our profits are either returned to you every quarter or invested in
          a green future. <a class="h3" href="/pocket/362022120043053129"
            >Read the plan.</a
          >
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
