import { supabase } from "@/src/lib/supabase";
import { useState, useCallback } from "react";

export default function USE_fetchSharedLists() {
  const [ARE_sharedListsFetching, SET_sharedListsFetching] = useState(false);
  const [sharedLists_ERROR, SET_error] = useState<string | null>(null);

  const FETCH_sharedLists = useCallback(async (user_id: string) => {
    // Check if userId is provided
    if (!user_id) {
      console.error("🔴 User ID is required. 🔴");
      SET_error("🔴 User ID is required. 🔴");
      return {
        success: false,
        data: null,
        msg: "🔴 User ID is required. 🔴",
        error: "User ID is not provided.",
      };
    }

    SET_sharedListsFetching(true);
    SET_error(null);

    try {
      // Fetch all list_access entries for the provided user_id
      const { data: accessData, error: accessError } = await supabase
        .from("list_access")
        .select("list_id")
        .eq("participant_id", user_id);

      // Check for errors in fetching list_access
      if (accessError) {
        console.error("Error fetching list access entries:", accessError);
        SET_error("🔴 Error fetching list access entries. 🔴");
        return {
          success: false,
          data: null,
          msg: "🔴 Error fetching list access entries. 🔴",
          error: accessError.message,
        };
      }

      // Extract unique list IDs from the fetched access data
      const listIds = [...new Set(accessData?.map((entry) => entry.list_id))];

      // Fetch lists that match the list IDs and have type "shared"
      const { data: listData, error: listError } = await supabase
        .from("lists")
        .select(
          `
          id,
          name,
          description,
          vocabs(count),
          owner:users!lists_2_user_id_fkey(username)
        `
        )
        .in("id", listIds)
        .eq("type", "shared");

      // Check for errors in fetching lists
      if (listError) {
        console.error("Error fetching shared lists:", listError);
        SET_error("🔴 Error fetching shared lists. 🔴");
        return {
          success: false,
          data: null,
          msg: "🔴 Error fetching shared lists. 🔴",
          error: listError.message,
        };
      }

      // Map over the fetched data to extract vocab_COUNT from vocabs
      const formattedData = listData?.map((list) => ({
        ...list,
        vocab_COUNT: list.vocabs[0]?.count || 0,
      }));

      return {
        success: true,
        data: formattedData, // returning the fetched shared lists with vocab counts
        msg: "🟢 Fetched shared lists successfully. 🟢",
        error: null,
      };
    } catch (error) {
      console.error("🔴 Unexpected error fetching shared lists: 🔴", error);
      SET_error("🔴 Unexpected error occurred. 🔴");
      return {
        success: false,
        data: null,
        msg: "🔴 Unexpected error occurred. 🔴",
        error: error?.message,
      };
    } finally {
      SET_sharedListsFetching(false);
    }
  }, []); // Empty dependency array means this will not re-create the function unless the component unmounts

  return { FETCH_sharedLists, ARE_sharedListsFetching, sharedLists_ERROR };
}
