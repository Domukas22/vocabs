import { useState, useEffect } from "react";
import { supabase } from "@/src/lib/supabase";
import { z_vocabDisplaySettings_PROPS } from "@/src/zustand";
import { BUILD_fetchVocabsOfPublicListQuery } from "../features/2_vocabs/utils/BUILD_fetchVocabsOfPublicListQuery";
import { BUILD_fetchPublicVocabsQuery } from "../features/2_vocabs/utils/BUILD_fetchPublicVocabsQuery";

export default function USE_supabasePublicVocabs({
  search,
  z_vocabDisplay_SETTINGS,
  paginateBy = 10, // Default value for pagination
}: {
  search: string;
  z_vocabDisplay_SETTINGS: z_vocabDisplaySettings_PROPS;
  paginateBy?: number;
}) {
  const [ARE_vocabsFetching, SET_vocabsFetching] = useState(false);
  const [fetchVocabs_ERROR, SET_error] = useState<string | null>(null);
  const [vocabs, SET_vocabs] = useState<any[]>([]);
  const [start, SET_start] = useState(0); // Start index for pagination
  const [end, SET_end] = useState(paginateBy); // End index for pagination
  const [IS_loadingMore, SET_loadingMore] = useState(false);
  const [HAS_reachedEnd, SET_hasReachedEnd] = useState(false);

  useEffect(() => {
    // Reset pagination when search or language filters change
    SET_vocabs([]); // Clear vocabs
    SET_start(0); // Reset start
    SET_end(paginateBy); // Reset end
    fetchVocabs({ start: 0, end: paginateBy }); // Fetch the initial set of vocabs
    SET_hasReachedEnd(false);
  }, [
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
    SET_vocabsFetching(true);
    SET_error(null);

    try {
      // Step 1: Fetch public lists' IDs
      const { data: listData, error: listError } = await supabase
        .from("lists")
        .select("id")
        .eq("type", "public");

      if (listError) {
        console.error("🔴 Error fetching lists: 🔴", listError);
        SET_error("🔴 Error fetching lists. 🔴");
        return;
      }

      const list_ids = listData?.map((list) => list.id) || [];

      // Step 2: Fetch vocabs associated with these public lists
      const query = BUILD_fetchPublicVocabsQuery({
        search,
        list_ids,
        z_vocabDisplay_SETTINGS,
        start,
        end,
      });

      // Execute the query
      const { data: vocabData, error: vocabError } = await query;

      if (vocabError) {
        console.error("🔴 Error fetching vocabs: 🔴", vocabError);
        SET_error("🔴 Error fetching vocabs. 🔴");
        return;
      }

      if (vocabData && vocabData.length < paginateBy) {
        SET_hasReachedEnd(true);
      }

      // Set the fetched vocabs data
      SET_vocabs((prev) => [...prev, ...(vocabData || [])]); // Append new vocabs
    } catch (error) {
      console.error("🔴 Unexpected error fetching vocabs: 🔴", error);
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
