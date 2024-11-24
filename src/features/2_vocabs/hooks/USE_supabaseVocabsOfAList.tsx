import { useState, useEffect } from "react";
import { BUILD_fetchVocabsOfPublicListQuery } from "../utils/BUILD_fetchVocabsOfPublicListQuery";
import List_MODEL from "@/src/db/models/List_MODEL";
import { z_vocabDisplaySettings_PROPS } from "@/src/zustand";

export default function USE_supabaseVocabsOfAList({
  search,
  list,
  z_vocabDisplay_SETTINGS,
  paginateBy = 10, // Default value for pagination
}: {
  search: string;
  list: List_MODEL | undefined;
  z_vocabDisplay_SETTINGS: z_vocabDisplaySettings_PROPS;
  paginateBy?: number;
}) {
  const [ARE_vocabsFetching, SET_vocabsFetching] = useState(false);
  const [fetchVocabs_ERROR, SET_error] = useState<string | null>(null);
  const [vocabs, SET_vocabs] = useState<any[]>([]);
  const [start, SET_start] = useState(0);
  const [end, SET_end] = useState(paginateBy);
  const [IS_loadingMore, SET_loadingMore] = useState(false);
  const [HAS_reachedEnd, SET_hasReachedEnd] = useState(false);

  useEffect(() => {
    // Reset pagination when search, list_id, or languageFilters change
    SET_vocabs([]); // Clear vocabs
    SET_start(0); // Reset start
    SET_end(paginateBy); // Reset end
    fetchVocabs({ start: 0, end: paginateBy }); // Fetch the initial set of vocabs
    SET_hasReachedEnd(false);
  }, [
    list?.id,
    search,
    z_vocabDisplay_SETTINGS?.langFilters,
    z_vocabDisplay_SETTINGS?.sorting,
    z_vocabDisplay_SETTINGS?.sortDirection,
  ]); // Depend on relevant changes

  const fetchVocabs = async ({
    start,
    end,
  }: {
    start: number;
    end: number;
  }) => {
    if (!list?.id) {
      // console.error("🔴 List ID is required. 🔴");
      // SET_error("🔴 List ID is required. 🔴");
      SET_vocabs([]);
      return;
    }

    SET_vocabsFetching(true);
    SET_error(null);

    try {
      // Build the query using the helper function
      const query = BUILD_fetchVocabsOfPublicListQuery({
        search,
        list_id: list?.id,
        z_vocabDisplay_SETTINGS,
        start,
        end,
      });

      // Execute the query
      const { data: vocabData, error: vocabError } = await query;

      // Check for errors in the response
      if (vocabError) {
        console.error("🔴 Error fetching vocabs for the list: 🔴", vocabError);
        SET_error("🔴 Error fetching vocabs for the list. 🔴");
        return;
      }

      if (vocabData && vocabData.length < paginateBy) {
        SET_hasReachedEnd(true);
      }

      // Set the fetched vocabs data
      SET_vocabs((prev) => [...prev, ...(vocabData || [])]); // Append new vocabs
    } catch (error) {
      console.error(
        "🔴 Unexpected error fetching vocabs for the list: 🔴",
        error
      );
      SET_error("🔴 Unexpected error occurred. 🔴");
    } finally {
      SET_vocabsFetching(false);
    }
  };

  const LOAD_more = async () => {
    const newStart = start + paginateBy;
    const newEnd = end + paginateBy;

    SET_loadingMore(true);
    SET_start(newStart); // Increment start
    SET_end(newEnd); // Increment end

    await fetchVocabs({ start: newStart, end: newEnd }); // Fetch more vocabs
    SET_loadingMore(false);
  };

  return {
    vocabs,
    ARE_vocabsFetching,
    fetchVocabs_ERROR,
    LOAD_more,
    IS_loadingMore,
    HAS_reachedEnd,
  };
}
