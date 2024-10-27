import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/src/lib/supabase";

export default function USE_totalPublicListCount() {
  const [vocab_COUNT, SET_vocab_COUNT] = useState<number | null>(null);
  const [IS_totalCountFetching, SET_totalCountFetching] = useState(false);
  const [fetchTotalCount_ERROR, SET_error] = useState<string | null>(null);

  // Fetch total count of public lists
  const fetchTotalCount = useCallback(async () => {
    SET_totalCountFetching(true);
    SET_error(null);

    try {
      // Query to fetch the total count of lists with type: "public"
      const { count, error } = await supabase
        .from("lists")
        .select("id", { count: "exact" })
        .eq("type", "public");

      if (error) {
        console.error(`🔴 Error fetching total public list count:`, error);
        SET_error(`🔴 Error fetching total public list count. 🔴`);
        return;
      }

      // Update total count state
      SET_vocab_COUNT(count || 0);
    } catch (error) {
      console.error(
        `🔴 Unexpected error fetching total public list count: 🔴`,
        error
      );
      SET_error(`🔴 Unexpected error occurred. 🔴`);
    } finally {
      SET_totalCountFetching(false);
    }
  }, []);

  // Fetch the total count on the first render
  useEffect(() => {
    fetchTotalCount();
  }, [fetchTotalCount]);

  return {
    vocab_COUNT,
    IS_totalCountFetching,
    fetchTotalCount_ERROR,
  };
}
