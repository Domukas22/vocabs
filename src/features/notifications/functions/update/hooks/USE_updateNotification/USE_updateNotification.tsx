//
//
//

import db, { Notifications_DB } from "@/src/db";
import { useCallback, useMemo, useState } from "react";
import Notifications_MODEL from "@/src/db/models/Notifications_MODEL";

interface NotificationUpdateStatus_MODEL {
  value: boolean;
  target: string | null;
}

export function USE_updateNotification() {
  const [IS_notificationUpdating, SET_notificationUpdating] =
    useState<NotificationUpdateStatus_MODEL>({ value: false, target: null });
  const [updateNotification_ERROR, SET_error] = useState<string | null>(null);
  const RESET_notificationError = useCallback(() => SET_error(null), []);

  const errorMessage = useMemo(
    () =>
      "Some kind of error happened while updating the notification. This is an issue on our side. Please try to reload the app and see if the problem persists. The issue has been recorded and will be reviewed by developers. We apologize for the trouble.",
    []
  );

  const EDIT_notificationReadStatus = async (
    notification_id: string,
    isRead: boolean
  ): Promise<{
    success: boolean;
    data?: Notifications_MODEL;
    msg?: string;
  }> => {
    SET_error(null); // Clear any previous error

    if (!notification_id) {
      SET_error("🔴 Notification ID is required to update read status 🔴");
      return { success: false };
    }

    try {
      SET_notificationUpdating({ value: true, target: notification_id });

      const updatedNotification = await db.write(async () => {
        const notification = await Notifications_DB.find(notification_id);

        if (!notification) {
          throw new Error("Notification not found");
        }

        await notification.update((notif: Notifications_MODEL) => {
          notif.is_read = isRead;
        });

        return notification;
      });

      return { success: true, data: updatedNotification };
    } catch (error: any) {
      if (error.message === "Failed to fetch") {
        SET_error(
          "It looks like there's an issue with your internet connection. Please check your connection and try again."
        );
      } else {
        SET_error(errorMessage);
      }
      return {
        success: false,
        msg: `🔴 Unexpected error occurred during notification update 🔴: ${error.message}`,
      };
    } finally {
      SET_notificationUpdating({ value: false, target: null });
    }
  };

  return {
    EDIT_notificationReadStatus,
    IS_notificationUpdating,
    updateNotification_ERROR,
    RESET_notificationError,
  };
}
