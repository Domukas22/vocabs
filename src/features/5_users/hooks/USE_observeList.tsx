//
//
//

import { Lists_DB } from "@/src/db";
import { List_MODEL } from "@/src/db/watermelon_MODELS";
import { useEffect, useState } from "react";

export default function USE_observeList(
  list_id?: string
): List_MODEL | undefined {
  const [_list, SET_list] = useState<List_MODEL | undefined>();

  useEffect(() => {
    // If no `list_id` is provided, reset state and exit early
    if (!list_id) {
      SET_list(undefined);
      return;
    }

    // Subscribe to the observable
    const subscription = Lists_DB.findAndObserve(list_id).subscribe({
      next: SET_list, // Directly update state with the emitted value
      error: () => SET_list(undefined), // Reset state on error
    });

    // Cleanup subscription on unmount or when `list_id` changes
    return () => subscription.unsubscribe();
  }, [list_id]);

  return _list;
}
