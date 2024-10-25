import { supabase } from "@/src/lib/supabase";
import { useState, useEffect, useRef, useCallback } from "react";

const cache = new Map<string, any>(); // Basic in-memory cache

export default function USE_fetchOneSharedList(listId: string) {
  const [IS_sharedListFetching, SET_sharedListFetching] = useState(false);
  const [sharedList_ERROR, SET_error] = useState<string | null>(null);
  const [sharedList, SET_sharedList] = useState<any | null>(null);
  const cacheRef = useRef(cache); // Reference to cache map to avoid recreating

  useEffect(() => {
    const fetchOneSharedList = async () => {
      // Check if listId is provided
      if (!listId) {
        console.error("🔴 List ID is required. 🔴");
        SET_error("🔴 List ID is required. 🔴");
        SET_sharedList(null);
        return;
      }

      // Check if list is already cached
      if (cacheRef.current.has(listId)) {
        SET_sharedList(cacheRef.current.get(listId));
        return;
      }

      SET_sharedListFetching(true);
      SET_error(null);

      try {
        // Fetch the shared list with the specified list ID
        const { data: listData, error: listError } = await supabase
          .from("lists")
          .select("*")
          .eq("id", listId)
          .eq("type", "shared")
          .single(); // Ensures only one item is fetched

        // Check for errors in fetching the list
        if (listError) {
          console.error("🔴 Error fetching the shared list:", listError);
          SET_error("🔴 Error fetching the shared list. 🔴");
          SET_sharedList(null);
          return;
        }

        // Cache the fetched list data
        cacheRef.current.set(listId, listData);
        SET_sharedList(listData);
      } catch (error) {
        console.error(
          "🔴 Unexpected error fetching the shared list: 🔴",
          error
        );
        SET_error("🔴 Unexpected error occurred. 🔴");
        SET_sharedList(null);
      } finally {
        SET_sharedListFetching(false);
      }
    };

    // Trigger fetching only if listId is provided
    if (listId) {
      fetchOneSharedList();
    }
  }, [listId]); // Depend on listId

  return { sharedList, IS_sharedListFetching, sharedList_ERROR };
}
