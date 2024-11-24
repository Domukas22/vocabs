//
//
//
//

import { useState, useEffect, useCallback } from "react";
import { z_listDisplaySettings_PROPS } from "@/src/zustand";
import { BUILD_fetchPublicListsQuery } from "../../1_lists/utils/BUILD_fetchPublicListsQuery";
import { FetchedSharedList_PROPS } from "../../1_lists/utils/props";

export default function USE_supabasePublicLists({
  search,
  z_listDisplay_SETTINGS,
  paginateBy = 10, // Default pagination size
}: {
  search: string;
  z_listDisplay_SETTINGS: z_listDisplaySettings_PROPS;
  paginateBy?: number;
}) {
  const [ARE_listsFetching, SET_listsFetching] = useState(false);
  const [fetchLists_ERROR, SET_error] = useState<string | null>(null);
  const [lists, SET_lists] = useState<any[]>([]);
  const [start, SET_start] = useState(0); // Start index for pagination
  const [end, SET_end] = useState(paginateBy); // End index for pagination
  const [filteredList_COUNT, SET_filteredListCount] = useState<number>(0);
  const [IS_loadingMore, SET_loadingMore] = useState(false);
  const [HAS_reachedEnd, SET_hasReachedEnd] = useState(false);

  // Fetch public lists whenever the search or relevant settings change
  useEffect(() => {
    // Reset pagination and fetch the first set of lists
    SET_lists([]); // Clear the previous lists
    SET_start(0); // Reset start index
    SET_end(paginateBy); // Reset end index
    fetchPublicLists({ start: 0, end: paginateBy }); // Fetch initial set of public lists
    SET_hasReachedEnd(false);
  }, [search, z_listDisplay_SETTINGS]);

  // Function to fetch public lists with pagination
  const fetchPublicLists = useCallback(
    async ({ start, end }: { start: number; end: number }) => {
      SET_listsFetching(true);
      SET_error(null);

      try {
        const query = BUILD_fetchPublicListsQuery({
          search,
          z_listDisplay_SETTINGS,
          start,
          end,
        });

        // // Execute the query
        const { data: listData, error: listError, count } = await query;

        if (listError) {
          console.error(`Error fetching public lists:`, listError);
          SET_error(`🔴 Error fetching public lists. 🔴`);
          // return;
        }

        if (listData && listData.length < paginateBy) {
          SET_hasReachedEnd(true);
        }

        // Format the data to include vocab_COUNT
        const formattedData = listData?.map((list) => ({
          ...list,
          vocab_COUNT: list.vocabs?.[0]?.count || 0,
        }));

        // Update the list state with fetched data
        SET_lists((prev) =>
          formattedData ? [...prev, ...formattedData] : prev
        );
        SET_filteredListCount(count || 0);
      } catch (error) {
        console.error(`🔴 Unexpected error fetching public lists: 🔴`, error);
        SET_error(`🔴 Unexpected error occurred. 🔴`);
      } finally {
        SET_listsFetching(false);
      }
    },
    [z_listDisplay_SETTINGS, search]
  );

  // Function to load more lists (for pagination)
  const LOAD_more = async () => {
    if (IS_loadingMore) return;

    const newStart = start + paginateBy;
    const newEnd = end + paginateBy;

    SET_loadingMore(true);
    SET_start(newStart);
    SET_end(newEnd);

    await fetchPublicLists({ start: newStart, end: newEnd });
    SET_loadingMore(false);
  };

  return {
    lists,
    ARE_listsFetching,
    fetchLists_ERROR,
    LOAD_more,
    IS_loadingMore,
    HAS_reachedEnd,
    filteredList_COUNT,
  };
}

export type FetchedPublicList_PROPS = {
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

function USE_publicLists({
  search,
  user_id,
  z_listDisplay_SETTINGS,
}: {
  search: string;
  user_id: string | undefined;
  z_listDisplay_SETTINGS: z_listDisplaySettings_PROPS;
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
        const allowedLists_IDS = await FETCH_participantListAccesses(user_id);
        const uniqueAllowedList_IDS = AGGREGATE_uniqueStrings(
          allowedLists_IDS?.map((x) => x.list_id) || []
        );

        const { lists, count, error } = await FETCH_sharedLists({
          search,
          list_ids: uniqueAllowedList_IDS,
          z_listDisplay_SETTINGS,
          start,
          end,
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
