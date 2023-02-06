import type { Notification, NotificationStore } from '@magicbell/core';
import { get, writable } from 'svelte/store';

export interface NotificationsStore {
  instance?: NotificationStore;
  unread_count: number;
  items: Notification[];
}

export const Notifications = writable<NotificationsStore>({
  unread_count: 0,
  items: [],
  instance: undefined
});

export const reloadNotifications = async () => {
  const store = get(Notifications).instance;

  if (store) {
    await store.fetch({}, { reset: true });

    Notifications.update((prev) => {
      return {
        instance: prev.instance,
        unread_count: store.unreadCount,
        items: store.items
      };
    });
  }
};
