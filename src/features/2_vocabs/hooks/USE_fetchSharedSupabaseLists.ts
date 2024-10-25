import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/src/lib/supabase";
import { z_listDisplaySettings_PROPS } from "@/src/zustand";
import { BUILD_fetchSharedListsQuery } from "../../1_lists/utils/BUILD_fetchSharedListsQuery";

export default function USE_fetchSharedSupabaseLists({
  search,
  z_listDisplay_SETTINGS,
  user_id,
  paginateBy = 10, // Default pagination size
}: {
  search: string;
  z_listDisplay_SETTINGS: z_listDisplaySettings_PROPS;
  user_id: string;
  paginateBy?: number;
}) {
  const [ARE_listsFetching, SET_listsFetching] = useState(false);
  const [sharedLists_ERROR, SET_error] = useState<string | null>(null);
  const [sharedLists, SET_sharedLists] = useState<any[]>([]);
  const [start, SET_start] = useState(0); // Start index for pagination
  const [end, SET_end] = useState(paginateBy); // End index for pagination
  const [IS_loadingMore, SET_loadingMore] = useState(false);
  const [HAS_reachedEnd, SET_hasReachedEnd] = useState(false);

  // Fetch shared lists whenever the search or relevant settings change
  useEffect(() => {
    if (!user_id) {
      console.error("🔴 User ID is required. 🔴");
      SET_error("🔴 User ID is required. 🔴");
      return;
    }

    // Reset pagination and fetch the first set of lists
    SET_sharedLists([]); // Clear the previous lists
    SET_start(0); // Reset start index
    SET_end(paginateBy); // Reset end index
    fetchSharedLists({ start: 0, end: paginateBy }); // Fetch initial set of shared lists
    SET_hasReachedEnd(false);
  }, [search, z_listDisplay_SETTINGS, user_id]);

  // Function to fetch shared lists with pagination
  const fetchSharedLists = useCallback(
    async ({ start, end }: { start: number; end: number }) => {
      SET_listsFetching(true);
      SET_error(null);

      try {
        // Fetch all list access entries for the provided user_id
        const { data: accessData, error: accessError } = await supabase
          .from("list_access")
          .select("list_id")
          .eq("participant_id", user_id);

        // Check for errors in fetching list_access
        if (accessError) {
          console.error("Error fetching list access entries:", accessError);
          SET_error("🔴 Error fetching list access entries. 🔴");
          return;
        }

        // Extract unique list IDs from the fetched access data
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

        // Fetch lists that match the list IDs and apply search filtering
        const { data: listData, error: listError } = await query;

        // Check for errors in fetching lists
        if (listError) {
          console.error("Error fetching shared lists:", listError);
          SET_error("🔴 Error fetching shared lists. 🔴");
          return;
        }

        if (listData && listData.length < paginateBy) {
          SET_hasReachedEnd(true);
        }

        // Map over the fetched data to extract vocab_COUNT from vocabs
        const formattedData = listData?.map((list) => ({
          ...list,
          vocab_COUNT: list.vocabs[0]?.count || 0,
        }));

        // Update the list state with fetched data
        SET_sharedLists((prev) => [...prev, ...formattedData]);
      } catch (error) {
        console.error("🔴 Unexpected error fetching shared lists: 🔴", error);
        SET_error("🔴 Unexpected error occurred. 🔴");
      } finally {
        SET_listsFetching(false);
      }
    },
    [user_id, search, z_listDisplay_SETTINGS, paginateBy]
  );

  // Function to load more lists (for pagination)
  const LOAD_more = async () => {
    if (IS_loadingMore) return;

    const newStart = start + paginateBy;
    const newEnd = end + paginateBy;

    SET_loadingMore(true);
    SET_start(newStart);
    SET_end(newEnd);

    await fetchSharedLists({ start: newStart, end: newEnd });
    SET_loadingMore(false);
  };

  return {
    sharedLists,
    ARE_listsFetching,
    sharedLists_ERROR,
    LOAD_more,
    IS_loadingMore,
    HAS_reachedEnd,
  };
}
