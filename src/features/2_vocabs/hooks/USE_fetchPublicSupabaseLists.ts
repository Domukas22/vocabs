import { useState, useEffect, useCallback } from "react";
import { z_listDisplaySettings_PROPS } from "@/src/zustand";
import { supabase } from "@/src/lib/supabase";
import { BUILD_fetchPublicListsQuery } from "../../1_lists/utils/BUILD_fetchPublicListsQuery";
export default function USE_fetchPublicSupabaseLists({
  search,
  z_listDisplay_SETTINGS,
  paginateBy = 10, // Default pagination size
}: {
  search: string;
  z_listDisplay_SETTINGS: z_listDisplaySettings_PROPS;
  paginateBy?: number;
}) {
  const [ARE_listsFetching, SET_listsFetching] = useState(false);
  const [publicLists_ERROR, SET_error] = useState<string | null>(null);
  const [publicLists, SET_publicLists] = useState<any[]>([]);
  const [start, SET_start] = useState(0); // Start index for pagination
  const [end, SET_end] = useState(paginateBy); // End index for pagination
  const [IS_loadingMore, SET_loadingMore] = useState(false);
  const [HAS_reachedEnd, SET_hasReachedEnd] = useState(false);

  // Fetch public lists whenever the search or relevant settings change
  useEffect(() => {
    // Reset pagination and fetch the first set of lists
    SET_publicLists([]); // Clear the previous lists
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
        const { data: listData, error: listError } = await query;

        if (listError) {
          console.error("Error fetching public lists:", listError);
          SET_error("🔴 Error fetching public lists. 🔴");
          return;
        }

        if (listData && listData.length < paginateBy) {
          SET_hasReachedEnd(true);
        }

        // Format the data to include vocab_COUNT
        const formattedData = listData.map((list) => ({
          ...list,
          vocab_COUNT: list.vocabs?.[0]?.count || 0,
        }));

        // Update the list state with fetched data
        SET_publicLists((prev) => [...prev, ...formattedData]);
      } catch (error) {
        console.error("🔴 Unexpected error fetching public lists: 🔴", error);
        SET_error("🔴 Unexpected error occurred. 🔴");
      } finally {
        SET_listsFetching(false);
      }
    },
    [z_listDisplay_SETTINGS, search]
  );

  // Function to load more lists (for pagination)
  const LOAD_more = async () => {
    const newStart = start + paginateBy;
    const newEnd = end + paginateBy;

    SET_loadingMore(true);
    SET_start(newStart);
    SET_end(newEnd);

    await fetchPublicLists({ start: newStart, end: newEnd });
    SET_loadingMore(false);
  };

  return {
    publicLists,
    ARE_listsFetching,
    publicLists_ERROR,
    LOAD_more,
    IS_loadingMore,
    HAS_reachedEnd,
  };
}
