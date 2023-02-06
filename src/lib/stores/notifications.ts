import type { Notification } from '@magicbell/core';
import { writable } from 'svelte/store';

export interface NotificationsStore {
  unread_count: number;
  items: Notification[];
}

export const Notifications = writable<NotificationsStore>({
  unread_count: 0,
  items: []
});
