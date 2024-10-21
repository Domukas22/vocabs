///
import { useMemo } from "react";
import { Lists_DB } from "@/src/db";

// Custom hook to observe a list by its ID
export function USE_observeList(list_id: string | undefined) {
  // Memoize the observable to avoid unnecessary re-evaluations
  return useMemo(() => {
    if (list_id && typeof list_id === "string") {
      // Find and observe the list with the given ID
      return Lists_DB.findAndObserve(list_id);
    }
    return undefined;
  }, [list_id]);
}
