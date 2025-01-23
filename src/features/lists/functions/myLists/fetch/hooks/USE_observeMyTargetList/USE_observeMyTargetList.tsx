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

    console.log(
      "fetch started at: ",
      (new Date().getSeconds() + new Date().getMilliseconds() / 1000).toFixed(2)
    );

    // If no `list_id` is provided, reset state and exit early
    if (!list_id) {
      SET_list(undefined);
      return;
    }

    // Subscribe to the observable
    const subscription = Lists_DB.findAndObserve(list_id).subscribe({
      next: (data) => {
        SET_list(data);
        const endTime = new Date().getTime(); // Capture end time in milliseconds
        const duration = ((endTime - startTime) / 1000).toFixed(2); // Calculate the duration in seconds
        console.log(`fetch completed in ${duration} seconds`);
      },
      error: () => {
        SET_list(undefined);
        const endTime = new Date().getTime();
        const duration = ((endTime - startTime) / 1000).toFixed(2);
        console.log(`fetch failed in ${duration} seconds`);
      },
    });

    // Cleanup subscription on unmount or when `list_id` changes
    return () => subscription.unsubscribe();
  }, [list_id]);

  return list;
}
