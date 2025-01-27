//
//
//

import { Lists_DB } from "@/src/db";
import List_MODEL from "@/src/db/models/List_MODEL";
import { USE_zustand } from "@/src/hooks";
import { Q } from "@nozbe/watermelondb";

import { useEffect, useState } from "react";

export default function USE_observeMyList(): { lists: List_MODEL[] } {
  const [lists, SET_lists] = useState<List_MODEL[]>([]);
  const { z_user } = USE_zustand();

  useEffect(() => {
    // If no `list_id` is provided, reset state and exit early
    if (!z_user) {
      SET_lists([]);
      return;
    }

    // Subscribe to the observable
    const subscription = Lists_DB.query(Q.where("user_id", z_user?.id || ""))
      .observe()
      .subscribe({
        next: (data) => {
          SET_lists(data);
        },
        error: () => {
          SET_lists([]);
        },
      });

    // Cleanup subscription on unmount or when `list_id` changes
    return () => subscription.unsubscribe();
  }, [z_user]);

  return { lists };
}
