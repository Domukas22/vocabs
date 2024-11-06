//
//
//

import { supabase } from "@/src/lib/supabase";
import { useState, useCallback } from "react";

export default function USE_fetchListAccesses() {
  const [ARE_accessesFetching, SET_accessesFetching] = useState(false);
  const [accessesFetch_ERROR, SET_error] = useState<string | null>(null);

  const FETCH_accesses = useCallback(
    async ({ user_id, list_id }: { user_id: string; list_id: string }) => {
      // Check if userId and listId are provided
      if (!user_id) {
        const errorMsg = "🔴 User ID is required for fetching list accesses 🔴";
        console.error(errorMsg);
        SET_error(errorMsg);
        return {
          success: false,
          data: null,
          msg: errorMsg,
          error: "User ID not provided.",
        };
      }
      if (!list_id) {
        const errorMsg = "🔴 List ID is required for fetching list accesses 🔴";
        console.error(errorMsg);
        SET_error(errorMsg);
        return {
          success: false,
          data: null,
          msg: errorMsg,
          error: "List ID not provided.",
        };
      }

      SET_accessesFetching(true);
      SET_error(null);

      try {
        // Fetch all list_accesses entries for the provided user_id and list_id
        const { data: accessData, error: accessError } = await supabase
          .from("list_accesses")
          .select("participant_id")
          .eq("owner_id", user_id) // Assuming owner_id is the owner of the list
          .eq("list_id", list_id);

        // Check for errors in fetching list_accesses
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

        return {
          success: true,
          data: accessData, // returning the fetched list accesses
          msg: "🟢 Fetched list accesses successfully. 🟢",
          error: null,
        };
      } catch (error) {
        console.error("🔴 Unexpected error fetching list accesses: 🔴", error);
        SET_error("🔴 Unexpected error occurred. 🔴");
        return {
          success: false,
          data: null,
          msg: "🔴 Unexpected error occurred. 🔴",
          error: error?.message,
        };
      } finally {
        SET_accessesFetching(false);
      }
    },
    []
  ); // Empty dependency array means this will not re-create the function unless the component unmounts

  return { FETCH_accesses, ARE_accessesFetching, accessesFetch_ERROR };
}
