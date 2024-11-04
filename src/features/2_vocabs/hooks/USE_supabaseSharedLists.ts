import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/src/lib/supabase";
import { z_listDisplaySettings_PROPS } from "@/src/zustand";
import { BUILD_fetchSharedListsQuery } from "../../1_lists/utils/BUILD_fetchSharedListsQuery";
import { BUILD_fetchSharedListsCount } from "../../1_lists/utils/BUILD_fetchSharedListsCount";
import Delay from "@/src/utils/Delay";

export default function USE_supabaseSharedLists({
  search,
  z_listDisplay_SETTINGS,
  user_id,
  paginateBy = 10, // Default pagination size
}: {
  search: string;
  z_listDisplay_SETTINGS: z_listDisplaySettings_PROPS;
  user_id: string | undefined;
  paginateBy?: number;
}) {
  const [filteredList_COUNT, SET_filteredListCount] = useState<number>(0);
  const [sharedLists_ERROR, SET_error] = useState<string | null>(null);
  const [sharedLists, SET_sharedLists] = useState<any[]>([]);

  const { IS_fetching, IS_loadingMore, reset, LOAD_more } = USE_pagination({
    paginateBy,
    action: async (start: number, end: number) => {
      await fetchSharedLists({ start, end });
    },
  });

  // AbortController to cancel previous requests
  const abortControllerRef = useRef<AbortController | null>(null);

  // Fetch shared lists whenever the search or relevant settings change
  useEffect(() => {
    if (!user_id) {
      console.error("🔴 User ID is required. 🔴");
      SET_error("🔴 User ID is required. 🔴");
      return;
    }

    // Reset pagination and fetch the first set of lists
    SET_sharedLists([]);
    reset();
  }, [search, z_listDisplay_SETTINGS, user_id]);

  const fetchSharedLists = useCallback(
    async ({ start, end }: { start: number; end: number }) => {
      if (abortControllerRef.current) {
        // Abort the previous request if it exists
        abortControllerRef.current.abort();
      }

      // Create a new AbortController for the current request
      const abortController = new AbortController();
      abortControllerRef.current = abortController;

      // SET_listsFetching(true);
      SET_error(null);

      try {
        const { data: accessData, error: accessError } = await supabase
          .from("list_access")
          .select("list_id")
          .eq("participant_id", user_id)
          .abortSignal(abortController.signal); // Pass the abort signal here

        if (accessError) {
          console.error(
            "Error fetching list access entries when fetching shared lists:",
            accessError
          );
          SET_error(
            "🔴 Error fetching list access entries when fetching shared lists. 🔴"
          );
          return;
        }

        const list_ids = [
          ...new Set(accessData?.map((entry) => entry.list_id)),
        ];

        const query = BUILD_fetchSharedListsQuery({
          search,
          list_ids,
          z_listDisplay_SETTINGS,
          start,
          end,
        });

        const { data: lists, error: listError, count } = await query;

        if (listError) {
          console.error("Error fetching shared lists:", listError);
          SET_error("🔴 Error fetching shared lists. 🔴");
          return;
        }

        const formattedData = lists?.map((list) => ({
          ...list,
          vocab_COUNT: list.vocabs[0]?.count || 0,
        }));

        SET_sharedLists((prev) => [...prev, ...formattedData]);
        SET_filteredListCount(count || 0);
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("🔴 Unexpected error fetching shared lists: 🔴", error);
          SET_error("🔴 Unexpected error occurred. 🔴");
        }
      } finally {
        // SET_listsFetching(false);
      }
    },
    [user_id, search, z_listDisplay_SETTINGS, paginateBy]
  );

  return {
    sharedLists,
    ARE_listsFetching: IS_fetching,
    sharedLists_ERROR,
    LOAD_more,
    IS_loadingMore,
    filteredList_COUNT,
  };
}

function USE_pagination({
  paginateBy = 5,
  action = async () => {},
}: {
  paginateBy: number;
  action: (start: number, end: number) => Promise<void>;
}) {
  const [start, SET_start] = useState(0);
  const [end, SET_end] = useState(paginateBy);
  const [IS_fetching, SET_fetching] = useState(false);
  const [IS_loadingMore, SET_loadingMore] = useState(false);

  async function LOAD_more() {
    if (IS_fetching) return;
    SET_loadingMore(true);

    const new_START = start + paginateBy;
    const new_END = end + paginateBy;

    SET_start(new_START);
    SET_end(new_END);

    await Delay(2000);
    await action(new_START, new_END);
    SET_loadingMore(false);
  }

  async function reset() {
    SET_fetching(true);

    const new_START = 0;
    const new_END = paginateBy;

    SET_start(new_START);
    SET_end(new_END);

    await Delay(2000);
    await action(new_START, new_END);
    SET_fetching(false);
  }

  return { IS_fetching, IS_loadingMore, reset, LOAD_more };
}

function USE_loadMore({
  allowed = false,
  action = async () => {},
}: {
  allowed: boolean;
  action: () => Promise<void>;
}) {
  const [IS_loadingMore, SET_loadingMore] = useState(false);

  async function LOAD_more() {
    if (!allowed) return;
    SET_loadingMore(true);
    await action();
    SET_loadingMore(false);
  }

  return { LOAD_more, IS_loadingMore };
}
