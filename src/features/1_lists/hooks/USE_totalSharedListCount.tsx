import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/src/lib/supabase";

export default function USE_totalSharedListCount(participant_id: string) {
  const [vocab_COUNT, SET_totalCount] = useState<number | null>(null);
  const [IS_totalCountFetching, SET_totalCountFetching] = useState(false);
  const [fetchTotalCount_ERROR, SET_fetchTotalCount_ERROR] = useState<
    string | null
  >(null);

  const fetchTotalCount = useCallback(async () => {
    if (!participant_id) {
      console.error("🔴 Participant ID is required. 🔴");
      SET_fetchTotalCount_ERROR("🔴 Participant ID is required. 🔴");
      return;
    }

    SET_totalCountFetching(true);
    SET_fetchTotalCount_ERROR(null);

    try {
      // Fetch all list access entries for the provided participant_id
      const { data: accessData, error: accessError } = await supabase
        .from("list_access")
        .select("list_id")
        .eq("participant_id", participant_id);

      // Check for errors in fetching list_access
      if (accessError) {
        console.error("Error fetching list access entries:", accessError);
        SET_fetchTotalCount_ERROR("🔴 Error fetching list access entries. 🔴");
        return;
      }

      // Extract unique list IDs from the fetched access data
      const list_ids = [...new Set(accessData?.map((entry) => entry.list_id))];

      if (list_ids.length === 0) {
        SET_totalCount(0); // If no lists are found, set the count to zero
        return;
      }

      // Fetch the count of shared lists that match the list IDs
      const { count, error: countError } = await supabase
        .from("lists")
        .select("id", { count: "exact", head: true }) // Fetch only the count
        .in("id", list_ids)
        .eq("type", "shared");

      // Check for errors in fetching the count
      if (countError) {
        console.error("Error fetching shared lists count:", countError);
        SET_fetchTotalCount_ERROR("🔴 Error fetching shared lists count. 🔴");
        return;
      }

      // Set the total count of shared lists
      SET_totalCount(count || 0);
    } catch (error) {
      console.error(
        "🔴 Unexpected error fetching shared lists count: 🔴",
        error
      );
      SET_fetchTotalCount_ERROR("🔴 Unexpected error occurred. 🔴");
    } finally {
      SET_totalCountFetching(false);
    }
  }, [participant_id]);

  useEffect(() => {
    fetchTotalCount();
  }, [fetchTotalCount]);

  return {
    vocab_COUNT,
    IS_totalCountFetching,
    fetchTotalCount_ERROR,
  };
}
