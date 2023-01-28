import type { Fill } from '$lib/zod/Fill';
import type { ThemeAnyValue } from '$lib/zod/Theme';
import { writable } from 'svelte/store';

export interface AppStore {
  theme: ThemeAnyValue;
  fill: Fill;
  sheet_id: string;
  loading: boolean;
}

export const App = writable<AppStore>({
  theme: 'system',
  fill: 'superlight',
  sheet_id: '',
  loading: false
});
