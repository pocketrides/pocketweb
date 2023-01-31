import type { Writable } from 'svelte/store';

export const STYTCH_CONTEXT_ID = 'stytch';

export type StytchContext = Writable<'challenge' | 'verify'>;
