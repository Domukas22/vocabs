import { useEffect, useMemo, useState } from "react";
import { Lists_DB } from "@/src/db";
import { Q, Query } from "@nozbe/watermelondb";
import { List_MODEL } from "@/src/db/watermelon_MODELS";

import { z_listDisplaySettings_PROPS } from "@/src/zustand";
import FetchLists_QUERY from "../utils/FetchLists_QUERY";

export default function USE_observedLists({
  search,
  user_id,
  z_listDisplay_SETTINGS,
}: {
  search: string;
  user_id: string | undefined;
  z_listDisplay_SETTINGS: z_listDisplaySettings_PROPS | undefined;
}) {
  const [lists, SET_lists] = useState<List_MODEL[] | undefined>(undefined);

  useEffect(() => {
    const query = FetchLists_QUERY({
      search,
      user_id,
      z_listDisplay_SETTINGS,
    }).observe();

    const subscription = query.subscribe({
      next: (updated_LISTS) => {
        SET_lists(updated_LISTS?.length > 0 ? updated_LISTS : undefined);
      },
    });

    // Clean up the subscription
    return () => subscription.unsubscribe();
  }, [search, z_listDisplay_SETTINGS]);

  return lists;
}
