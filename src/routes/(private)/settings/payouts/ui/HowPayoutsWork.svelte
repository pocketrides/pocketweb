<script lang="ts">
  import Container from '$lib/components/Container.svelte';
  import Icon from '$lib/components/Icon.svelte';

  export let step1_done: boolean = false;
  export let step2_done: boolean = false;
  export let step3_hidden: boolean = false;
  export let step3_hidden_icon: string = 'verified';
  export let step3_hidden_reason: string = 'Pending Verification';
</script>

<Container rounded fill="system-superlight">
  <div data-flex="v" data-gap="1">
    <div data-flex="v" data-gap="1">
      <div>
        <h2>How payouts work</h2>
        {#if !step3_hidden}
          <p>It's a three-step process to get paid on Pocketrides:</p>
        {/if}
      </div>
      {#if step1_done}
        <Container rounded padded fill="dark">
          <h3 class="h2 thin half">
            <Icon icon="done" />
            Step 1: Get 500 likes.
          </h3>
        </Container>
      {:else}
        <div>
          <h3 class="h2">Step 1: Get 500 likes.</h3>
          <p>
            It's not economical to transfer less than $5 to your bank, so when you've
            received at least 500 likes it's time for step 2.
          </p>
        </div>
      {/if}
      {#if step2_done}
        <Container rounded padded fill="dark">
          <h3 class="h2 thin half">
            <Icon icon="done" />
            Step 2: Stripe account
          </h3>
        </Container>
      {:else}
        <div>
          <h3 class="h2">Step 2: Stripe account</h3>
          <p>
            We partner with <a
              href="https://stripe.com"
              target="_blank"
              rel="noreferrer"
              class="h3">Stripe</a
            > to get you paid, which means you need an account with them. When you're
            ready to get paid the first time, it takes 2-3 minutes to create your account
            and then a few days to verify your information.
          </p>
        </div>
      {/if}
      {#if step3_hidden}
        <Container rounded padded bordered fill="superlight">
          <h3 class="h2">
            <Icon icon={step3_hidden_icon} />
            {step3_hidden_reason}
          </h3>
        </Container>
      {:else}
        <div>
          <h3 class="h2">Step 3: Start a Payout</h3>
          <p>
            After you've created a Stripe account, we'll begin a payout by adding up
            all the likes you've gotten and reconciling them in our system before
            transferring them to you.
          </p>
        </div>
      {/if}
    </div>
    <div data-flex="v cc" data-gap="1" class="wrapper">
      <slot />
    </div>
  </div>
</Container>
