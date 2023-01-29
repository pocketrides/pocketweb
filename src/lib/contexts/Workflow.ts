import type { Writable } from 'svelte/store';

export const WORKFLOW_CONTEXT_ID = 'workflow';

export type WorkflowContext = Writable<{
  initial: string;
  current: string;
  loading: boolean;
}>;
