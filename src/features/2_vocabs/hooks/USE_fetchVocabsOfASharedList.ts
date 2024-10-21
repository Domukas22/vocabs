import { supabase } from "@/src/lib/supabase";
import { useState, useCallback } from "react";

export default function USE_fetchVocabsOfASharedList() {
  const [ARE_vocabsFetching, SET_vocabsFetching] = useState(false);
  const [vocabs_ERROR, SET_error] = useState<string | null>(null);

  const FETCH_vocabs = useCallback(async (list_id: string) => {
    // Check if listId is provided
    if (!list_id) {
      console.error("🔴 List ID is required. 🔴");
      SET_error("🔴 List ID is required. 🔴");
      return {
        success: false,
        data: null,
        msg: "🔴 List ID is required. 🔴",
        error: "List ID is not provided.",
      };
    }

    SET_vocabsFetching(true);
    SET_error(null);

    try {
      // Fetch vocabs for the given list ID
      const { data: vocabData, error: vocabError } = await supabase
        .from("vocabs")
        .select("*")
        .eq("list_id", list_id)
        .order("created_at", { ascending: false });

      // Check for errors in the response
      if (vocabError) {
        console.error("🔴 Error fetching vocabs for the list: 🔴", vocabError);
        SET_error("🔴 Error fetching vocabs for the list. 🔴");
        return {
          success: false,
          data: null,
          msg: "🔴 Error fetching vocabs for the list. 🔴",
          error: vocabError.message,
        };
      }

      return {
        success: true,
        data: vocabData, // returning the fetched vocabs
        msg: "🟢 Fetched vocabs for the list successfully. 🟢",
        error: null,
      };
    } catch (error) {
      console.error(
        "🔴 Unexpected error fetching vocabs for the list: 🔴",
        error
      );
      SET_error("🔴 Unexpected error occurred. 🔴");
      return {
        success: false,
        data: null,
        msg: "🔴 Unexpected error occurred. 🔴",
        error: error.message,
      };
    } finally {
      SET_vocabsFetching(false);
    }
  }, []); // Empty dependency array means this will not re-create the function unless the component unmounts

  return { FETCH_vocabs, ARE_vocabsFetching, vocabs_ERROR };
}
