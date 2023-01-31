<script lang="ts">
  import { page } from '$app/stores';
  import { StripePaymentLink } from '$lib/api/stripe/payment_link';
  import Button from '$lib/components/Button.svelte';
  import Container from '$lib/components/Container.svelte';
  import { SHEET_CONTEXT_ID, type SheetContext } from '$lib/contexts/Sheet';
  import { App } from '$lib/stores/app';
  import { getContext, onMount } from 'svelte';
  import { writable } from 'svelte/store';

  const sheet_context = getContext<SheetContext>(SHEET_CONTEXT_ID);
  const loading = writable(true);

  let payment_link: string = '';

  onMount(async () => {
    // TODO: check if sub exists

    const payment_link_request = await StripePaymentLink.get();

    if (payment_link_request.success) {
      payment_link = payment_link_request.url;

      $sheet_context.dismissable = true;
      $sheet_context.header = 'Wanna subscribe?';
      $sheet_context.icon = 'favorite';
      $loading = false;
    }
  });

  const noThanksClick = () => {
    $App.sheet_id = '';
  };
</script>

{#if !$loading}
  <div data-flex="v" data-gap>
    <Container rounded={true} fill="superlight">
      <div data-flex="v cc" data-gap="1">
        <div data-flex="v as" data-gap>
          <h2>Everybody earns money here.</h2>
          <p>
            No magic (and no ads) on pocketrides! Likes are worth a penny and we ask
            you where to donate our company profits.
          </p>
        </div>
        <div class="wrapper">
          <Button label="Subscribe for $5/mo" href={payment_link} primary={true} />
        </div>
        <Button
          label="No thanks!"
          href={`/profile/${$page.data.my_nametag?.id}`}
          on:click={noThanksClick}
        />
      </div>
    </Container>
  </div>
{/if}

<style lang="scss">
  .wrapper {
    margin-top: 3rem;
  }
</style>
