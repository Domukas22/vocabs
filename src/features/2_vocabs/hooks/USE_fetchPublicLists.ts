import { supabase } from "@/src/lib/supabase";
import { useState, useCallback } from "react";

export default function USE_fetchPublicLists() {
  const [ARE_publicListsFetching, SET_publicListsFetching] = useState(false);
  const [publicLists_ERROR, SET_error] = useState<string | null>(null);

  const FETCH_publicLists = useCallback(async () => {
    SET_publicListsFetching(true);
    SET_error(null);

    try {
      // Fetch public lists
      const { data: listData, error: listError } = await supabase
        .from("lists")
        .select(
          `
          id,
          name,
          description,
          vocabs(count)
        `
        )
        .eq("type", "public");

      // Check for errors in fetching lists
      if (listError) {
        console.error("Error fetching public lists:", listError);
        SET_error("🔴 Error fetching public lists. 🔴");
        return {
          success: false,
          data: null,
          msg: "🔴 Error fetching public lists. 🔴",
          error: listError.message,
        };
      }

      // Map over the fetched data to extract vocab_COUNT from vocabs
      const formattedData = listData?.map((list) => ({
        ...list,
        vocab_COUNT: list.vocabs[0]?.count || 0,
      }));

      console.log("🟢 Fetched public lists 🟢");
      return {
        success: true,
        data: formattedData, // returning the fetched lists with vocab counts
        msg: "🟢 Fetched public lists successfully. 🟢",
        error: null,
      };
    } catch (error) {
      console.error("🔴 Unexpected error fetching public lists: 🔴", error);
      SET_error("🔴 Unexpected error occurred. 🔴");
      return {
        success: false,
        data: null,
        msg: "🔴 Unexpected error occurred. 🔴",
        error: error?.message,
      };
    } finally {
      SET_publicListsFetching(false);
    }
  }, []); // Empty dependency array means this will not re-create the function unless the component unmounts

  return { FETCH_publicLists, ARE_publicListsFetching, publicLists_ERROR };
}
