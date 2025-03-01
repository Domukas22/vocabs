import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/src/lib/supabase";
import Delay from "@/src/utils/Delay/Delay";

export function USE_collectSharedListLangs(user_id: string | undefined) {
  const [ARE_langIdsCollecting, SET_langIdsCollecting] = useState(false);
  const [collectLangIds_ERROR, SET_collectLangIds_ERROR] = useState<
    string | null
  >(null);
  const [collectedLang_IDS, SET_collectedLang_IDS] = useState<string[]>([]);

  // Function to fetch and aggregate unique collected language IDs
  const fetchAndAggregateLangIds = useCallback(async () => {
    SET_langIdsCollecting(true);
    SET_collectLangIds_ERROR(null);

    try {
      if (!user_id) {
        console.error(
          "🔴 User ID is required for collecting shared list accesses 🔴"
        );
        SET_collectLangIds_ERROR(
          "🔴 User ID is required for collecting shared list accesses 🔴"
        );
        return;
      }

      const { data: accessData, error: accessError } = await supabase
        .from("list_accesses")
        .select("list_id")
        .eq("participant_id", user_id);

      // Check for errors in fetching list_accesses
      if (accessError) {
        console.error(
          "🔴 Error fetching list access entries when trying to collect shared list accesses 🔴:",
          accessError
        );
        SET_collectLangIds_ERROR(
          "🔴 Error fetching list access entries when trying to collect shared list accesses 🔴"
        );
        return;
      }

      // Extract unique list IDs from the fetched access data
      const listIds = [...new Set(accessData?.map((entry) => entry.list_id))];

      // Fetch all public lists from the database
      const { data, error } = await supabase
        .from("lists") // Replace with your actual public lists table name
        .select("collected_lang_ids")
        .eq("type", "shared")
        .in("id", listIds);

      if (error) {
        console.error("Error fetching public lists:", error);
        SET_collectLangIds_ERROR("🔴 Error fetching public lists. 🔴");
        return;
      }

      if (data) {
        // Aggregate and get unique language IDs
        const uniqueLangIds = Array.from(
          new Set(
            data.flatMap((list) =>
              list.collected_lang_ids ? list.collected_lang_ids : []
            )
          )
        );

        // Update state with unique language IDs
        SET_collectedLang_IDS(uniqueLangIds);
      }
    } catch (err) {
      console.error("🔴 Unexpected error collecting language IDs: 🔴", err);
      SET_collectLangIds_ERROR("🔴 Unexpected error occurred. 🔴");
    } finally {
      SET_langIdsCollecting(false);
    }
  }, []);

  // Trigger fetching on component mount or relevant state changes
  useEffect(() => {
    fetchAndAggregateLangIds();
  }, [fetchAndAggregateLangIds]);

  return {
    collectedLang_IDS,
    ARE_langIdsCollecting,
    collectLangIds_ERROR,
  };
}
