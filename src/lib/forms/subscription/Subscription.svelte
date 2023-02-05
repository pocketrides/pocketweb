<script lang="ts">
  import { page } from '$app/stores';
  import { StripePaymentLink } from '$lib/api/stripe/payment_link';
  import { StripeSubscriptionStatus } from '$lib/api/stripe/subscription_status';
  import Button from '$lib/components/Button.svelte';
  import Container from '$lib/components/Container.svelte';
  import { SHEET_CONTEXT_ID, type SheetContext } from '$lib/contexts/Sheet';
  import { type WorkflowContext, WORKFLOW_CONTEXT_ID } from '$lib/contexts/Workflow';
  import { createEventDispatcher, getContext, onMount } from 'svelte';
  import { writable } from 'svelte/store';

  const dispatch = createEventDispatcher();
  const sheet_context = getContext<SheetContext>(SHEET_CONTEXT_ID);
  const workflow_context = getContext<WorkflowContext>(WORKFLOW_CONTEXT_ID);
  const loading = writable(true);

  let payment_link: string = '';

  $workflow_context.loading = true;

  onMount(async () => {
    const sub_status = await StripeSubscriptionStatus.get();

    if (sub_status.success && sub_status.subscribed) {
      dispatch('complete');
      return;
    }

    const payment_link_request = await StripePaymentLink.get();

    if (payment_link_request.success) {
      payment_link = payment_link_request.url;

      $sheet_context.dismissable = true;
      $sheet_context.header = 'Wanna subscribe?';
      $sheet_context.icon = 'favorite';
      $workflow_context.loading = false;
      $loading = false;
    }
  });

  const noThanksClick = () => {
    dispatch('complete');
  };
</script>

{#if !$loading}
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
        <div class="wrapper">
          <Button label="Subscribe for $5/mo" href={payment_link} primary />
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
