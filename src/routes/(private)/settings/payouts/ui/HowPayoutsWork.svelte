<script lang="ts">
  import Container from '$lib/components/Container.svelte';
  import Icon from '$lib/components/Icon.svelte';

  export let step1_done: boolean = false;
  export let step2_done: boolean = false;
  export let step3_hidden: boolean = false;
  export let step3_hidden_icon: string = 'verified';
  export let step3_hidden_reason: string = 'Pending Verification';
</script>

<Container rounded fill="system-light">
  <div data-flex="v" data-gap="1">
    <div data-flex="v" data-gap="1">
      <div>
        <h2>How payouts work</h2>
        {#if !step3_hidden}
          <p>It's a three-step process to get paid on Pocketrides:</p>
        {/if}
      </div>
      {#if step1_done}
        <Container rounded padded bordered fill="system-superlight">
          <div data-flex="v as">
            <h3 class="h2 thin half">
              <Icon icon="done" />
              Step 1: Get 500 likes.
            </h3>
          </div>
        </Container>
      {:else}
        <div>
          <h3 class="h2">Step 1: Get 500 likes.</h3>
          <p>
            Our bank transfer minimum is $5, and it looks like you don't have enough
            likes yet. Don't worry! The likes you earn will never expire.
          </p>
        </div>
      {/if}
      {#if step2_done}
        <Container rounded padded bordered fill="system-superlight">
          <div data-flex="v as">
            <h3 class="h2 thin half">
              <Icon icon="done" />
              Step 2: Stripe account
            </h3>
          </div>
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
            > to get you paid, which means you need a separate account with them. When
            you're ready to get paid the first time, it takes 2-3 minutes to create your
            account and then a few days to verify your information.
          </p>
        </div>
      {/if}
      {#if step3_hidden}
        <Container rounded padded bordered fill="superlight">
          <div data-flex="v as">
            <h3 class="h2">
              <Icon icon={step3_hidden_icon} />
              {step3_hidden_reason}
            </h3>
          </div>
        </Container>
      {:else}
        <div>
          <h3 class="h2">Step 3: Start a Payout</h3>
          <p>
            We'll start a payout for all the likes you've received so far, add them
            up, and transfer them to your Stripe account.
          </p>
        </div>
      {/if}
    </div>
    <div data-flex="v cc" data-gap="1" class="wrapper">
      <slot />
    </div>
    {#if !step2_done}
      <p>
        <small>
          <strong>
            <Icon icon="info" inline /> Heads up:
          </strong>
          You will have to verify your identity to get paid. Your relationship with Stripe
          is your own, refer to our
          <a href="/privacy-policy" target="_blank" rel="noreferrer">
            <strong>privacy policy</strong>
          </a> for details on the information that's shared with Pocketrides.
        </small>
      </p>
    {/if}
  </div>
</Container>
