//
//
//

import { z_listDisplaySettings_PROPS } from "@/src/zustand";
import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import FETCH_supabaseLists from "../utils/FETCH_supabaseLists";
import FORMAT_listVocabCount from "../utils/FORMAT_listVocabCount/FORMAT_listVocabCount";
import FETCH_listIdsSharedWithMe from "../../8_listAccesses/utils/FETCH_listIdsSharedWithMe/FETCH_listIdsSharedWithMe";
import AGGREGATE_uniqueStrings from "../utils/AGGREGATE_uniqueStrings";
import { FlatlistError_PROPS } from "@/src/props";
import USE_pagination from "@/src/hooks/USE_pagination";
import { LIST_PAGINATION } from "@/src/constants/globalVars";
import USE_isSearching from "@/src/hooks/USE_isSearching";
import FETCH_supabaseUsers from "../../5_users/utils/FETCH_supabaseUsers";

export interface FetchedUsers_PROPS {
  id: string;
  username: string;
}

export default function USE_supabaseUsers_2({
  search,
  IS_debouncing,
}: {
  search: string;
  IS_debouncing: boolean;
}) {
  const [data, SET_data] = useState<FetchedUsers_PROPS[]>([]);
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
  const IS_searching = USE_isSearching({
    IS_fetching,
    IS_debouncing,
    IS_loadingMore,
  });

  // Create a ref to store the current AbortController
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetch = useCallback(
    async (start: number, end: number) => {
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
        const { users, count, error } = await FETCH_supabaseUsers({
          search,
          start,
          end,
          signal: abortController.signal, // Pass the abort signal here
        });

        if (abortController.signal.aborted) {
          // Prevent updates if the request was aborted
          return;
        }

        if (error) console.error(error);

        SET_data((prev) => [...prev, ...users]);
        SET_unpaginatedCount(count || 0);
        // Only set error if it exists and request wasn’t aborted
        if (error) {
          SET_error(error);
        }
      } catch (error: any) {
        console.error("🔴 Error in USE_supabaseUsers_2: 🔴", error);
        SET_error({
          value: true,
          msg: `Some kind of error occurred while fetching users. This error has been recorded and will be reviewed by developers shortly. If the problem persists, please try to re-load the app or contact support. We apologize for the troubles.`,
        });
      } finally {
        SET_loadingMore(false);
        SET_fetching(false);
      }
    },
    [search]
  );

  const { RESET_pagination, paginate } = USE_pagination({
    paginateBy: LIST_PAGINATION || 20,
    fetch,
  });

  useEffect(() => {
    SET_data([]);
    RESET_pagination();
  }, [search]);

  return {
    data,
    error,
    IS_searching,
    HAS_reachedEnd,
    IS_loadingMore,
    unpaginated_COUNT,
    LOAD_more: paginate,
  };
}
