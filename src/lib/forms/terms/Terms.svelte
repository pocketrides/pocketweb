<script lang="ts">
  import { TermsAccept } from '$lib/api/terms/accept';
  import { TermsStatus, type TermsStatusResponse } from '$lib/api/terms/status';
  import Button from '$lib/components/Button.svelte';
  import Checkbox from '$lib/components/Checkbox.svelte';
  import { type SheetContext, SHEET_CONTEXT_ID } from '$lib/contexts/Sheet';
  import { type WorkflowContext, WORKFLOW_CONTEXT_ID } from '$lib/contexts/Workflow';
  import { createEventDispatcher, getContext, onMount } from 'svelte';
  import { writable } from 'svelte/store';

  const dispatch = createEventDispatcher();
  const context = getContext<SheetContext>(SHEET_CONTEXT_ID);
  const workflow_context = getContext<WorkflowContext>(WORKFLOW_CONTEXT_ID);
  const loading = writable(true);
  const submitting = writable(false);
  const data = writable<TermsStatusResponse>();

  let checked = false;
  let version: string;

  $workflow_context.loading = true;

  onMount(async () => {
    const result = await TermsStatus.get();

    if (result.success && result.accepted) {
      dispatch('complete');
      return;
    }

    if (result.success && result.accepted === false) {
      $data = result;
      version = $data.latest_version.version;

      $context.header = 'Terms of Use';
      $context.icon = 'done';
      $context.dismissable = false;
      $workflow_context.loading = false;

      $loading = false;
    }
  });

  const handleSubmit = async () => {
    $submitting = true;

    await TermsAccept.post({ version });

    dispatch('complete');
  };
</script>

{#if $loading === false && $data.success === true && $data.accepted === false}
  <form on:submit|preventDefault={handleSubmit} data-flex="v" data-gap>
    <div data-flex="v" data-gap>
      <h2>Please accept the Terms of Use to continue.</h2>
      <article>{@html $data.latest_version.summary}</article>
      <p class="small half">Latest version: {$data.latest_version.version}</p>
    </div>
    <div class="wrapper">
      <Checkbox bind:checked label="I accept" />
    </div>
    <div>
      <Button
        type="submit"
        system
        disabled={!checked || $submitting}
        label={$submitting ? 'One sec!' : 'Continue…'}
      />
    </div>
  </form>
{/if}

<style lang="scss">
  .wrapper {
    margin-top: 3rem;
  }
</style>
