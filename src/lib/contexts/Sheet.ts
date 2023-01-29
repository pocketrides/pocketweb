import type { Writable } from 'svelte/store';

export const SHEET_CONTEXT_ID = 'sheet';

export type SheetContext = Writable<{
  header?: string;
  icon?: string;
  dismissable: boolean;
}>;
