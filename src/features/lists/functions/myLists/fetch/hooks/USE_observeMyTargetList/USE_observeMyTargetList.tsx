//
//
//

import { Lists_DB } from "@/src/db";
import List_MODEL from "@/src/db/models/List_MODEL";

import { useEffect, useState } from "react";

export function USE_observeMyTargetList(
  list_id?: string | undefined
): List_MODEL | undefined {
  const [list, SET_list] = useState<List_MODEL | undefined>();

  useEffect(() => {
    const startTime = new Date().getTime(); // Capture start time in milliseconds

    // If no `list_id` is provided, reset state and exit early
    if (!list_id) {
      SET_list(undefined);
      return;
    }

    // Subscribe to the observable
    const subscription = Lists_DB.findAndObserve(list_id).subscribe({
      next: (data) => {
        SET_list(data);
      },
      error: () => {
        SET_list(undefined);
      },
    });

    // Cleanup subscription on unmount or when `list_id` changes
    return () => subscription.unsubscribe();
  }, [list_id]);

  return list;
}
