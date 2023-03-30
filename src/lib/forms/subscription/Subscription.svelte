<script lang="ts">
  import Button from '$lib/components/Button.svelte';
  import Container from '$lib/components/Container.svelte';
  import { createEventDispatcher } from 'svelte';
  import { writable } from 'svelte/store';
  import { trackGoal } from 'fathom-client';

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

<div data-flex="v" data-gap>
  <Container rounded bordered fill="system-superlight">
    <div data-flex="v cc" data-gap="1">
      <div data-flex="v as" data-gap>
        <h2>How Subscriptions work</h2>
        <p>
          <strong>Subscriptions are $5/month.</strong> Every month, you'll have 250 likes
          to give out to great content you see on Pocketrides.
        </p>
        <p>
          <strong>Every three months,</strong> we'll ask what to do with your share of
          Pocketrides' profits: make a donation to fight climate change, or transfer to
          your bank account. If we've done our math right, it'll be about $3 every quarter.
        </p>
        <p>
          <strong>In the meantime,</strong> we won't show you ads or sell your data.
          <strong>Ever.</strong>
        </p>
      </div>
      <div class="wrapper" data-flex="v cc" data-gap="1">
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
    </div>
  </Container>
</div>

<style lang="scss">
  .wrapper {
    margin: 3rem 0;
  }
</style>
