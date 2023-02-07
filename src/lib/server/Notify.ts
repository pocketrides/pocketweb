import type { NewNotification } from '@magicbell/core/dist/models/Notification/NewNotification';
import type { RequestEvent } from '@sveltejs/kit';

/**
 * MagicBell API wrapper
 */
export const Notify = async (event: RequestEvent, notification: NewNotification) => {
  await fetch('https://api.magicbell.com/notifications', {
    method: 'POST',
    headers: {
      'x-magicbell-api-key': event.locals.mb_api_key,
      'x-magicbell-api-secret': event.locals.mb_api_secret
    },
    body: JSON.stringify({
      notification: notification
    })
  });
};
