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
  <Container rounded fill="superlight">
    <div data-flex="v cc" data-gap="1">
      <div data-flex="v as" data-gap>
        <h2>Everybody earns money here.</h2>
        <p>
          No magic (and no ads) on pocketrides! Likes are worth a penny and we ask
          you where to donate 100% of the profits.
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
