//
//
//

import { useState, useEffect } from "react";
import { Q } from "@nozbe/watermelondb";
import Notifications_MODEL from "@/src/db/models/Notifications_MODEL";
import { Notifications_DB } from "@/src/db"; // Adjust import based on your DB instance location

export function USE_fetchNotifications(user_id: string | undefined) {
  const [ARE_notificationsFetching, SET_notificationsFetching] =
    useState(false);
  const [fetchNotifications_ERROR, SET_error] = useState<string | null>(null);
  const [notifications, SET_notifications] = useState<Notifications_MODEL[]>(
    []
  );

  useEffect(() => {
    // Fetch notifications when the user_id changes
    if (user_id) {
      FETCH_notifications(user_id);
    } else {
      SET_error("🔴 User ID is missing. Unable to fetch notifications. 🔴");
      SET_notifications([]);
    }
  }, [user_id]);

  const FETCH_notifications = async (user_id: string) => {
    SET_notificationsFetching(true);
    SET_error(null);

    try {
      // Validate user_id before querying
      if (!user_id) {
        SET_error("🔴 User ID is required to fetch notifications. 🔴");
        SET_notificationsFetching(false);
        return;
      }

      // Build the query to fetch notifications for the given user_id
      const query = Notifications_DB.query(
        Q.where("user_id", user_id),
        Q.where("deleted_at", null),
        Q.sortBy("created_at", Q.desc)
      );

      const fetchedNotifications = await query.fetch();

      // Check if any notifications are retrieved
      if (!fetchedNotifications.length) {
        SET_error("🔴 No notifications found for the given user ID. 🔴");
      }

      // Set fetched notifications
      SET_notifications(fetchedNotifications);
    } catch (error) {
      // Check if the error has specific information
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An unexpected error occurred.";
      console.error(
        "🔴 Unexpected error fetching notifications: 🔴",
        errorMessage
      );
      SET_error(
        `🔴 Unexpected error fetching notifications: ${errorMessage} 🔴`
      );
    } finally {
      SET_notificationsFetching(false);
    }
  };

  return {
    notifications,
    ARE_notificationsFetching,
    fetchNotifications_ERROR,
  };
}
