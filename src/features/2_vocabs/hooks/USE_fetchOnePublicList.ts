import { supabase } from "@/src/lib/supabase";
import { useState, useCallback } from "react";

export default function USE_fetchOnePublicList() {
  const [IS_publicListFetching, SET_publicListFetching] = useState(false);
  const [publicList_ERROR, SET_error] = useState<string | null>(null);

  const FETCH_onePublicList = useCallback(async (listId: string) => {
    // Check if listId is provided
    if (!listId) {
      console.error("🔴 List ID is required. 🔴");
      SET_error("🔴 List ID is required. 🔴");
      return {
        success: false,
        data: null,
        msg: "🔴 List ID is required. 🔴",
        error: "List ID is not provided.",
      };
    }

    SET_publicListFetching(true);
    SET_error(null);

    try {
      // Fetch the public list with the specified list ID
      const { data: listData, error: listError } = await supabase
        .from("lists")
        .select("*")
        .eq("id", listId)
        .eq("type", "public")
        .single(); // Ensures only one item is fetched

      // Check for errors in fetching the list
      if (listError) {
        console.error("Error fetching the public list:", listError);
        SET_error("🔴 Error fetching the public list. 🔴");
        return {
          success: false,
          data: null,
          msg: "🔴 Error fetching the public list. 🔴",
          error: listError.message,
        };
      }

      console.log("🟢 Fetched the public list 🟢");
      return {
        success: true,
        data: listData, // returning the fetched list with vocab count
        msg: "🟢 Fetched the public list successfully. 🟢",
        error: null,
      };
    } catch (error) {
      console.error("🔴 Unexpected error fetching the public list: 🔴", error);
      SET_error("🔴 Unexpected error occurred. 🔴");
      return {
        success: false,
        data: null,
        msg: "🔴 Unexpected error occurred. 🔴",
        error: error?.message,
      };
    } finally {
      SET_publicListFetching(false);
    }
  }, []); // Empty dependency array means this will not re-create the function unless the component unmounts

  return { FETCH_onePublicList, IS_publicListFetching, publicList_ERROR };
}
