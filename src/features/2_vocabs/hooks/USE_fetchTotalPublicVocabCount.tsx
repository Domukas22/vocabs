import { useState, useEffect } from "react";
import { supabase } from "@/src/lib/supabase";

export default function USE_fetchTotalPublicVocabCount() {
  const [total_COUNT, SET_total_COUNT] = useState<number | null>(null);
  const [IS_totalCountFetching, SET_totalCountFetching] =
    useState<boolean>(false);
  const [fetchTotalCount_ERROR, SET_fetchTotalCount_ERROR] = useState<
    string | null
  >(null);

  useEffect(() => {
    const fetchTotalPublicVocabCount = async () => {
      SET_totalCountFetching(true);
      SET_fetchTotalCount_ERROR(null);

      try {
        // Fetch all public list IDs
        const { data: publicLists, error: listsError } = await supabase
          .from("lists")
          .select("id")
          .eq("type", "public");

        // Handle errors in fetching the public lists
        if (listsError) {
          console.error("Error fetching public lists:", listsError);
          SET_fetchTotalCount_ERROR("Error fetching public lists.");
          SET_totalCountFetching(false);
          return;
        }

        // Extract the IDs from the fetched lists
        const publicListIds = publicLists?.map((list) => list.id) || [];

        if (publicListIds.length === 0) {
          SET_total_COUNT(0);
          SET_totalCountFetching(false);
          return;
        }

        // Fetch the count of vocabs related to public lists
        const { count, error: vocabsError } = await supabase
          .from("vocabs")
          .select("id", { count: "exact" })
          .in("list_id", publicListIds);

        // Handle errors in fetching the vocabs count
        if (vocabsError) {
          console.error(
            "Error fetching total public vocab count:",
            vocabsError
          );
          SET_fetchTotalCount_ERROR("Error fetching total public vocab count.");
          SET_totalCountFetching(false);
          return;
        }

        // Set the total count
        SET_total_COUNT(count || 0);
      } catch (error) {
        console.error(
          "Unexpected error fetching total public vocab count:",
          error
        );
        SET_fetchTotalCount_ERROR("Unexpected error occurred.");
      } finally {
        SET_totalCountFetching(false);
      }
    };

    // Fetch the total count when the component mounts
    fetchTotalPublicVocabCount();
  }, []);

  return {
    total_COUNT,
    IS_totalCountFetching,
    fetchTotalCount_ERROR,
  };
}
