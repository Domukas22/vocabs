//
//
//

import { z_listDisplaySettings_PROPS } from "@/src/zustand";
import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import FETCH_supabaseLists_OV from "../utils/FETCH_supabaseLists_OV/FETCH_supabaseLists_OV";
import FORMAT_listVocabCount from "../utils/FORMAT_listVocabCount/FORMAT_listVocabCount";
import FETCH_listIdsSharedWithMe from "../../8_listAccesses/utils/FETCH_listIdsSharedWithMe/FETCH_listIdsSharedWithMe";
import AGGREGATE_uniqueStrings from "../utils/AGGREGATE_uniqueStrings";
import { FlatlistError_PROPS } from "@/src/props";
import USE_pagination from "@/src/hooks/USE_pagination";
import { LIST_PAGINATION } from "@/src/constants/globalVars";
import USE_isSearching from "@/src/hooks/USE_isSearching";
import { FetchedSharedList_PROPS } from "../utils/props";
import { uniq } from "lodash";
import FETCH_supabaseLists from "../utils/FETCH_supabaseLists/FETCH_supabaseLists";
import USE_abortController from "@/src/hooks/USE_abortController";
import Delay from "@/src/utils/Delay";

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
  const [lists, SET_lists] = useState<FetchedSharedList_PROPS[]>([]);
  const [unpaginated_COUNT, SET_unpaginatedCount] = useState<number>(0);
  const [error, SET_error] = useState<FlatlistError_PROPS>({
    value: false,
    msg: "",
  });

  const { abortControllerRef, startNewRequest } = USE_abortController();

  const fetch = useCallback(
    async (start: number, end: number) => {
      if (!user_id) return;

      startNewRequest();
      SET_error({ value: false, msg: "" });

      try {
        let list_ids = null;

        if (type === "shared") {
          const { list_ids: allowedLists_IDS, error } =
            await FETCH_listIdsSharedWithMe(user_id);
          list_ids = uniq(allowedLists_IDS?.map((x) => x.list_id) || []);
        }

        const { data: { lists, count } = {}, error } =
          await FETCH_supabaseLists({
            search,
            list_ids,
            z_listDisplay_SETTINGS,
            start,
            end,
            type,
            signal: abortControllerRef?.current?.signal, // Pass the abort signal here
          });

        if (abortControllerRef?.current?.signal.aborted) {
          // Prevent updates if the request was aborted
          return;
        }

        // if error, throw error here
        if (error) {
          SET_error(error);
          return;
        }

        SET_lists((prev) => [...prev, ...(FORMAT_listVocabCount(lists) || [])]);
        SET_unpaginatedCount(count || 0);
        // Only set error if it exists and request wasn’t aborted
      } catch (error: any) {
        console.error("🔴 Error in USE_supabaseLists: 🔴", error);
        SET_error({
          value: true,
          msg: `Some kind of error occurred while searching for shared lists. This error has been recorded and will be reviewed by developers shortly. If the problem persists, please try to re-load the app or contact support. We apologize for the troubles.`,
        });
      }
    },
    [user_id, search, z_listDisplay_SETTINGS]
  );

  const { FETCH_new, FETCH_more, IS_loading, IS_loadingMore } =
    USE_pagination_NEW({
      // paginateBy: LIST_PAGINATION || 20,
      paginateBy: 2,
      fetch,
    });

  useEffect(() => {
    SET_lists([]);
    FETCH_new();
  }, [search, z_listDisplay_SETTINGS, user_id]);

  return {
    lists,
    error,
    IS_loading,
    IS_loadingMore,
    unpaginated_COUNT,
    LOAD_more: FETCH_more,
  };
}

function USE_pagination_NEW({
  paginateBy = 10,
  fetch = async () => {},
}: {
  paginateBy: number;
  fetch: (start: number, end: number) => Promise<void>;
}) {
  const [start, SET_start] = useState(0);
  const [end, SET_end] = useState(paginateBy);
  const [IS_loading, SET_isLoading] = useState(false);
  const [IS_loadingMore, SET_isLoadingMore] = useState(false);

  console.log("IS_loadingMore", IS_loadingMore);

  const FETCH_more = async () => {
    try {
      start + paginateBy >= paginateBy
        ? SET_isLoadingMore(true)
        : SET_isLoading(true);
      const newStart = start + paginateBy;
      const newEnd = end + paginateBy;
      SET_start(newStart);
      SET_end(newEnd);
      await fetch(newStart, newEnd);
    } catch (error: any) {
      console.log("Error in USE_pagination_NEW 'paginate' function");
    } finally {
      SET_isLoading(false);
      SET_isLoadingMore(false);
    }
  };

  const FETCH_new = async () => {
    try {
      SET_isLoading(true);
      SET_start(0);
      SET_end(paginateBy);
      await fetch(0, paginateBy);
    } catch (error: any) {
      console.log("Error in USE_pagination_NEW 'RESET_pagination' function");
    } finally {
      SET_isLoading(false);
    }
  };

  return { FETCH_new, FETCH_more, IS_loading, IS_loadingMore };
}

function USE_pagination_2<Data_PROPS, Error_PROPS>({
  paginateBy, // Number of items per page (e.g., 20)
  fetch, // Fetch function to call with pagination params (start, end)
}: {
  paginateBy: number;
  fetch: (
    start: number,
    end: number
  ) => Promise<{ data?: Data_PROPS; error?: Error_PROPS; count?: number }>;
}) {
  // State to track current page, loading status, and whether more items are available
  const [current_PAGE, SET_currentPage] = useState(1);
  const [loading, SET_isLoading] = useState(false);
  const [DOES_haveMore, SET_doesHaveMore] = useState(true);

  // Function to trigger data fetching for the next page
  const paginate = useCallback(async () => {
    if (loading || !DOES_haveMore) return;

    SET_isLoading(true);

    // Calculate start and end based on the current page and items per page
    const start = (current_PAGE - 1) * paginateBy;
    const end = current_PAGE * paginateBy;

    try {
      const { data, error, count } = await fetch(start, end);

      // If the data is empty, it means we've reached the end
      if (data?.length === 0 || data?.length < paginateBy) {
        SET_doesHaveMore(false); // No more items to fetch
      }

      // Increment the page number for the next fetch
      SET_currentPage((prev) => prev + 1);
    } catch (error) {
      console.error("Error fetching paginated data:", error);
      // Optionally handle error state here
    } finally {
      SET_isLoading(false);
    }
  }, [current_PAGE, paginateBy, fetch, loading, DOES_haveMore]);

  // Function to reset the pagination when the search or filter changes
  const RESET_pagination = useCallback(() => {
    SET_currentPage(1);
    SET_doesHaveMore(true);
  }, []);

  return { paginate, RESET_pagination, loading, DOES_haveMore, current_PAGE };
}
