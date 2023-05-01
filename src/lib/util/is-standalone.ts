import { browser } from '$app/environment';

// @ts-ignore
export const is_standalone = browser && navigator.standalone === true;
