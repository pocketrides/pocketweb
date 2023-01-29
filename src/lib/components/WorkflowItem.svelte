<script lang="ts">
  import { WORKFLOW_CONTEXT_ID, type WorkflowContext } from '$lib/contexts/Workflow';
  import { createEventDispatcher, getContext } from 'svelte';
  import { fade } from 'svelte/transition';

  export let name: string;
  export let component: any;
  export let next: string | undefined = undefined;

  const dispatch = createEventDispatcher();
  const context = getContext<WorkflowContext>(WORKFLOW_CONTEXT_ID);

  const complete = () => {
    if (next) $context.current = next;
    dispatch('complete');
  };
</script>

{#if $context.current === name && $context.current !== $context.initial}
  <div
    in:fade|local={{ delay: 250, duration: 250 }}
    out:fade|local={{ duration: 250 }}
  >
    <svelte:component this={component} on:complete={complete} />
  </div>
{:else if $context.current === name}
  <div out:fade|local={{ duration: 250 }}>
    <svelte:component this={component} on:complete={complete} />
  </div>
{/if}
