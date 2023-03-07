<script lang="ts">
  import { WORKFLOW_CONTEXT_ID, type WorkflowContext } from '$lib/contexts/Workflow';
  import { createEventDispatcher, getContext } from 'svelte';

  export let name: string;
  export let component: any;
  export let next: string | undefined = undefined;

  const dispatch = createEventDispatcher();
  const context = getContext<WorkflowContext>(WORKFLOW_CONTEXT_ID);

  const complete = (e: CustomEvent) => {
    if (next) $context.current = next;
    dispatch('complete', e.detail);
  };
</script>

{#if $context.current === name && $context.current !== $context.initial}
  <div>
    <svelte:component this={component} on:complete={complete} />
  </div>
{:else if $context.current === name}
  <div>
    <svelte:component this={component} on:complete={complete} />
  </div>
{/if}

<style lang="scss">
  div {
    width: 100%;
  }
</style>
