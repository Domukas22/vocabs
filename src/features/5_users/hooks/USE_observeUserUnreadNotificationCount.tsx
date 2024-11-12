//
//
//

import { Notifications_DB, Vocabs_DB } from "@/src/db";
import { Q } from "@nozbe/watermelondb";
import { useEffect, useState } from "react";

export default function USE_observeUserUnreadNotificationCount(
  user_id: string | undefined
) {
  const [count, SET_count] = useState(0);

  useEffect(() => {
    // If no user_id is provided, exit early
    if (!user_id) return;

    // Create a query that observes the count of vocabs for the specified user
    const query = Notifications_DB.query(
      Q.where("deleted_at", null),
      Q.where("user_id", user_id),
      Q.where("is_read", false)
    ).observeCount();

    // Subscribe to the query to update the state when the count changes
    const subscription = query.subscribe({
      next: (count) => {
        SET_count(count); // Update state with the count
      },
    });

    // Clean up the subscription on unmount
    return () => subscription.unsubscribe();
  }, [user_id]);

  return count;
}
