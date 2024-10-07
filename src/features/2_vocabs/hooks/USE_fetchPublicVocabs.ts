import { supabase } from "@/src/lib/supabase";
import { useState, useCallback } from "react";

export default function USE_fetchPublicVocabs() {
  const [ARE_publicVocabsFetching, SET_publicVocabsFetching] = useState(false);
  const [publicVocabs_ERROR, SET_error] = useState<string | null>(null);

  const FETCH_publicVocabs = useCallback(async () => {
    SET_publicVocabsFetching(true);
    SET_error(null);

    try {
      // Prepare the query
      const { data, error } = await supabase
        .from("vocabs")
        .select("*, translations(*)")
        .eq("is_public", true)
        .order("created_at", { ascending: false });

      // Check for errors in the response
      if (error) {
        console.error("🔴 Error fetching public vocabs: 🔴", error);
        SET_error("🔴 Error fetching public vocabs. 🔴");
        return {
          success: false,
          data: null,
          msg: "🔴 Error fetching public vocabs. 🔴",
          error: error.message,
        };
      }

      console.log("🟢 Fetched public vocabs 🟢");
      return {
        success: true,
        data, // returning the fetched data
        msg: "🟢 Fetched public vocabs successfully. 🟢",
        error: null,
      };
    } catch (error) {
      console.error("🔴 Unexpected error fetching public vocabs: 🔴", error);
      SET_error("🔴 Unexpected error occurred. 🔴");
      return {
        success: false,
        data: null,
        msg: "🔴 Unexpected error occurred. 🔴",
        error: error.message,
      };
    } finally {
      SET_publicVocabsFetching(false);
    }
  }, []); // Empty dependency array means this will not re-create the function unless the component unmounts

  return { FETCH_publicVocabs, ARE_publicVocabsFetching, publicVocabs_ERROR };
}
