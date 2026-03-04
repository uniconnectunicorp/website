"use client";

import { useNotifications } from "@/hooks/useNotifications";

export function NotificationsInit() {
  useNotifications();
  return null;
}
