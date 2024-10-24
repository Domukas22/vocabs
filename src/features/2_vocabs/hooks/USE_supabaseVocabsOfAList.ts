import { useState, useEffect } from "react";
import {
  BUILD_fetchVocabsOfPublicListQuery,
  VocabFilter_PROPS,
} from "../utils/BUILD_fetchVocabsOfPublicListQuery";

export default function USE_supabaseVocabsOfAList({
  search,
  list_id,
  z_display_SETTINGS,
}: VocabFilter_PROPS) {
  const [ARE_vocabsFetching, SET_vocabsFetching] = useState(false);
  const [fetchVocabs_ERROR, SET_error] = useState<string | null>(null);
  const [vocabs, SET_vocabs] = useState<any[]>([]);

  useEffect(() => {
    // Fetch vocabs when the list_id or relevant filters change
    const fetchVocabs = async () => {
      // Check if list_id is provided
      if (!list_id) {
        console.error("🔴 List ID is required. 🔴");
        SET_error("🔴 List ID is required. 🔴");
        SET_vocabs([]);
        return;
      }

      SET_vocabsFetching(true);
      SET_error(null);

      try {
        // Build the query using the helper function
        const query = BUILD_fetchVocabsOfPublicListQuery({
          search,
          list_id,
          z_display_SETTINGS,
        });

        // Execute the query
        const { data: vocabData, error: vocabError } = await query;

        // Check for errors in the response
        if (vocabError) {
          console.error(
            "🔴 Error fetching vocabs for the list: 🔴",
            vocabError
          );
          SET_error("🔴 Error fetching vocabs for the list. 🔴");
          SET_vocabs([]);
          return;
        }

        // Set the fetched vocabs data
        SET_vocabs(vocabData || []);
      } catch (error) {
        console.error(
          "🔴 Unexpected error fetching vocabs for the list: 🔴",
          error
        );
        SET_error("🔴 Unexpected error occurred. 🔴");
        SET_vocabs([]);
      } finally {
        SET_vocabsFetching(false);
      }
    };

    // Trigger fetching only if list_id is provided
    fetchVocabs();
  }, [list_id, search, z_display_SETTINGS]); // Depend on list_id, search, and display settings

  return { vocabs, ARE_vocabsFetching, fetchVocabs_ERROR };
}
