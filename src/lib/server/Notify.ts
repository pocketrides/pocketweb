import { MagicbellConfig } from './MagicbellConfig';
import type { NewNotification } from '@magicbell/core/dist/models/Notification/NewNotification';

/**
 * MagicBell API wrapper
 */
export const Notify = async (notification: NewNotification) => {
  await fetch('https://api.magicbell.com/notifications', {
    method: 'POST',
    headers: {
      'x-magicbell-api-key': MagicbellConfig.MAGICBELL_KEY,
      'x-magicbell-api-secret': MagicbellConfig.MAGICBELL_SECRET
    },
    body: JSON.stringify({
      notification
    })
  });
};

export const TopicSubscribe = async (external_id: string, topic: string) => {
  await fetch(`https://api.magicbell.com/subscriptions`, {
    method: 'POST',
    headers: {
      'x-magicbell-api-key': MagicbellConfig.MAGICBELL_KEY,
      'x-magicbell-api-secret': MagicbellConfig.MAGICBELL_SECRET,
      'X-MAGICBELL-USER-EXTERNAL-ID': external_id
    },
    body: JSON.stringify({
      subscription: {
        categories: [
          {
            slug: '*'
          }
        ],
        topic
      }
    })
  });
};
