import * as Sentry from '@sentry/svelte';
import type { HandleClientError } from '@sveltejs/kit';

// Sentry.init({
//   dsn: 'https://e3db4eb46baa4f43a32d1b98567638e4@o4504929428766720.ingest.sentry.io/4504929430274048',
//   integrations: [new Sentry.BrowserTracing()],

//   // Set tracesSampleRate to 1.0 to capture 100%
//   // of transactions for performance monitoring.
//   // We recommend adjusting this value in production
//   tracesSampleRate: 0.5,
//   denyUrls: ['10.0.0.16:5174']
// });

// Sentry.setTag('sveltekit', 'browser');

export const handleError = (({ error, event }) => {
  // Sentry.captureException(error, { contexts: { sveltekit: { event } } });

  return {
    // @ts-ignore
    message: error.message
  };
}) satisfies HandleClientError;
