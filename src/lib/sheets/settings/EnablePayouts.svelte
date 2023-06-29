<script lang="ts">
  import Sheet from '$lib/components/Sheet.svelte';
  import Container from '$lib/components/Container.svelte';
  import Button from '$lib/components/Button.svelte';
  import { StripeCreateAccountRequest } from '$lib/api/stripe/create_account';
  import { writable } from 'svelte/store';

  const busy = writable(false);
  const error = writable(false);
  const current_label = writable('Get started');

  const getStarted = async () => {
    $busy = true;
    $current_label = 'One sec!';
    const create_request = await StripeCreateAccountRequest.post();

    if (create_request.success === true) {
      $current_label = 'Sending you to Stripe…';
      location.href = '/_/stripe/account/onboard';
    } else {
      $current_label = 'Get started';
      $error = true;
      $busy = false;
    }
  };
</script>

<Sheet
  id="enable_payouts"
  header="Enable payouts"
  icon="account_balance"
  close="Cancel"
>
  <Container rounded fill="system-superlight">
    <div data-flex="v cc" data-gap="1">
      <div data-flex="v as" data-gap>
        <h2>Here's how it works:</h2>
        <ol data-flex="v as" data-gap>
          <li>Our partners at Stripe collect your banking & tax details</li>
          <li>You're approved for bank transfers</li>
          <li>
            Once approved, come back to settings and tap <strong>Get paid</strong>
          </li>
        </ol>
      </div>
      <div class="wrapper" data-flex="v cc" data-gap>
        <Button
          label={$current_label}
          disabled={$busy}
          primary
          xlarge
          on:click={getStarted}
        />
        {#if $error}
          <h3>Sorry, something went wrong! Try again.</h3>
        {/if}
      </div>
    </div>
  </Container>
</Sheet>

<style lang="scss">
  ol {
    margin: 0;
  }

  .wrapper {
    margin-top: 3rem;
  }
</style>
