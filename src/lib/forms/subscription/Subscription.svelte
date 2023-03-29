<script lang="ts">
  import Button from '$lib/components/Button.svelte';
  import Container from '$lib/components/Container.svelte';
  import { createEventDispatcher } from 'svelte';
  import { writable } from 'svelte/store';

  const dispatch = createEventDispatcher();

  const loading = writable(false);

  const subscribeClick = () => {
    $loading = true;
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
          <strong>Subscriptions are $5/month.</strong> You'll get 250 likes to give to
          your friends.
        </p>
        <p>
          Every quarter, we'll ask what to do with your share of the profits: a
          donation to fight climate change, or a transfer to your bank.
        </p>
        <p>In the meantime, we won't show you ads or sell your data. Ever.</p>
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
