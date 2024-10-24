//
//
//

import { supabase } from "@/src/lib/supabase";
import { useState, useEffect, useRef, useMemo } from "react";

const cache = new Map<string, any>(); // Basic in-memory cache

export default function USE_fetchOnePublicList(list_id: string) {
  const [IS_listFetching, SET_listFetching] = useState(false);
  const [listFetch_ERROR, SET_error] = useState<string | null>(null);
  const [list, SET_list] = useState<any | null>(null);
  const cacheRef = useRef(cache); // Reference to cache map to avoid recreating

  useEffect(() => {
    // Memoized fetch function to avoid unnecessary calls
    const fetchOnePublicList = async () => {
      // Check if listId is provided
      if (!list_id) {
        console.error("🔴 List ID is required. 🔴");
        SET_error("🔴 List ID is required. 🔴");
        SET_list(null);
        return;
      }

      // Check if list is already cached
      if (cacheRef.current.has(list_id)) {
        SET_list(cacheRef.current.get(list_id));
        return;
      }

      SET_listFetching(true);
      SET_error(null);

      try {
        // Fetch the public list with the specified list ID
        const { data: listData, error: listError } = await supabase
          .from("lists")
          .select("*")
          .eq("id", list_id)
          .eq("type", "public")
          .single(); // Ensures only one item is fetched

        // Check for errors in fetching the list
        if (listError) {
          console.error("🔴 Error fetching the public list:", listError);
          SET_error("🔴 Error fetching the public list. 🔴");
          SET_list(null);
          return;
        }

        // Cache the fetched list data
        cacheRef.current.set(list_id, listData);
        SET_list(listData);
      } catch (error) {
        console.error(
          "🔴 Unexpected error fetching the public list: 🔴",
          error
        );
        SET_error("🔴 Unexpected error occurred. 🔴");
        SET_list(null);
      } finally {
        SET_listFetching(false);
      }
    };

    // Trigger fetching only if list_id is provided
    fetchOnePublicList();
  }, [list_id]); // Depend on list_id

  return { list, IS_listFetching, listFetch_ERROR };
}
