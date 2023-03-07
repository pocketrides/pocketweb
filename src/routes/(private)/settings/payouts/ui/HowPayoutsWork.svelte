<script lang="ts">
  import Container from '$lib/components/Container.svelte';
</script>

<Container rounded fill="superlight">
  <div data-flex="v" data-gap="1">
    <h2>How payouts work</h2>
    <div data-flex="v" data-gap>
      <p>
        First we'll scan your content to check it's not against our <a
          href="/terms-of-use"
          class="h3">Terms of Use</a
        >. If it's good to go, you get paid for how many likes it has. Disagree with
        our scan? You'll have a chance to appeal.
      </p>
      <p>Next we'll check your older posts for new likes since your last payout.</p>
      <p>
        Finally we'll transfer the sum to our partners at Stripe, where you can link
        your bank account and start the deposit to your bank account.
      </p>
    </div>
    <div data-flex="v cc" data-gap="1" class="wrapper">
      <slot />
    </div>
  </div>
</Container>

<style lang="scss">
  .wrapper {
    margin-top: 3rem;
  }
</style>
