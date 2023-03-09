<script lang="ts">
  import Container from '$lib/components/Container.svelte';
</script>

<Container rounded fill="superlight">
  <div data-flex="v" data-gap="1">
    <div data-flex="v" data-gap>
      <div>
        <h2>How payouts work</h2>
        <p>It's a three-step process to get paid on Pocketrides:</p>
      </div>
      <div>
        <h3>Step 1: Get 500 likes.</h3>
        <p>
          It's not economical to transfer less than $5 to your bank, so when you've
          received at least 500 likes it's time for step 2.
        </p>
      </div>
      <div>
        <h3>Step 2: Create a Stripe account</h3>
        <p>
          We partner with <a
            href="https://stripe.com"
            target="_blank"
            rel="noreferrer"
            class="h3">Stripe</a
          > to get you paid, which means you need an account with them. When you're ready
          to get paid the first time, it takes 2-3 minutes to create your account.
        </p>
      </div>
      <div>
        <h3>Step 3: Start a Payout</h3>
        <p>
          After you've created a Stripe account, we'll begin a payout by adding up
          all the likes you've gotten and reconciling them in our system before
          transferring them to you.
        </p>
      </div>
    </div>
    <div data-flex="v cc" data-gap="1" class="wrapper">
      <slot />
    </div>
  </div>
</Container>
