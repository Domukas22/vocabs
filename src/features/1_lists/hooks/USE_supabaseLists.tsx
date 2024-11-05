//
//
//

import { z_listDisplaySettings_PROPS } from "@/src/zustand";
import { useState, useCallback, useMemo, useRef } from "react";
import FETCH_supabaseLists from "../utils/FETCH_supabaseLists";
import FORMAT_listVocabCount from "../utils/FORMAT_listVocabCount";
import FETCH_participantListAccesses from "../utils/FETCH_participantListAccess";
import AGGREGATE_uniqueStrings from "../utils/AGGREGATE_uniqueStrings";
import { FlatlistError_PROPS } from "@/src/props";

export type FetchedSharedList_PROPS = {
  id: string;
  name: string;
  description: string;
  collected_lang_ids: string;
  owner: {
    username: string;
  }[];
  vocabs: {
    count: number;
  }[];
};

export default function USE_supabaseLists({
  search,
  user_id,
  z_listDisplay_SETTINGS,
  type,
}: {
  search: string;
  user_id: string | undefined;
  z_listDisplay_SETTINGS: z_listDisplaySettings_PROPS;
  type: "public" | "shared";
}) {
  const [data, SET_data] = useState<FetchedSharedList_PROPS[]>([]);
  const [unpaginated_COUNT, SET_unpaginatedCount] = useState<number>(0);
  const [IS_fetching, SET_fetching] = useState(false);
  const [error, SET_error] = useState<FlatlistError_PROPS>({
    value: false,
    msg: "",
  });
  const [IS_loadingMore, SET_loadingMore] = useState(false);
  const HAS_reachedEnd = useMemo(
    () => data?.length >= unpaginated_COUNT,
    [data, unpaginated_COUNT]
  );

  // Create a ref to store the current AbortController
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetch = useCallback(
    async (start: number, end: number) => {
      if (!user_id) return;

      // Abort the previous fetch if it's still ongoing
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Create a new AbortController for this request
      const abortController = new AbortController();
      abortControllerRef.current = abortController;

      start > 0 ? SET_loadingMore(true) : SET_fetching(true);
      // Clear error at the beginning of a new fetch to avoid flickering
      SET_error({ value: false, msg: "" });

      try {
        let list_ids = null;

        if (type === "shared") {
          const allowedLists_IDS = await FETCH_participantListAccesses(user_id);
          const uniqueAllowedList_IDS = AGGREGATE_uniqueStrings(
            allowedLists_IDS?.map((x) => x.list_id) || []
          );

          list_ids = uniqueAllowedList_IDS;
        }

        const { lists, count, error } = await FETCH_supabaseLists({
          search,
          list_ids,
          z_listDisplay_SETTINGS,
          start,
          end,
          type,
          signal: abortController.signal, // Pass the abort signal here
        });

        if (abortController.signal.aborted) {
          // Prevent updates if the request was aborted
          return;
        }

        const formated_LISTS = FORMAT_listVocabCount(lists) || [];

        SET_data((prev) => [...prev, ...formated_LISTS]);
        SET_unpaginatedCount(count || 0);
        // Only set error if it exists and request wasn’t aborted
        if (error) {
          SET_error(error);
        }
      } catch (error: any) {
        console.error("🔴 Error in USE_sharedLists: 🔴", error);
        SET_error({
          value: true,
          msg: `Some kind of error occurred while searching for shared lists. This error has been recorded and will be reviewed by developers shortly. If the problem persists, please try to re-load the app or contact support. We apologize for the troubles.`,
        });
      } finally {
        SET_loadingMore(false);
        SET_fetching(false);
      }
    },
    [user_id, search, z_listDisplay_SETTINGS]
  );

  return {
    data,
    error,
    IS_fetching,
    HAS_reachedEnd,
    IS_loadingMore,
    unpaginated_COUNT,
    fetch,
    RESET_data: () => SET_data([]),
  };
}
