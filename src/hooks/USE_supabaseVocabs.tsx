import { useState, useEffect } from "react";
import { supabase } from "@/src/lib/supabase";
import { z_vocabDisplaySettings_PROPS } from "@/src/zustand";
import { BUILD_fetchPublicVocabsQuery } from "../features/2_vocabs/utils/BUILD_fetchPublicVocabsQuery";
import Delay from "../utils/Delay";

export default function USE_supabaseVocabs({
  search,
  z_vocabDisplay_SETTINGS,
  paginateBy = 10,
  fetchByList = false,
  targetList_ID = undefined,
}: {
  search: string;
  z_vocabDisplay_SETTINGS: z_vocabDisplaySettings_PROPS;
  paginateBy?: number;

  // either both or none need to be defined
  fetchByList?: boolean;
  targetList_ID?: string | undefined;
}) {
  const [ARE_vocabsFetching, SET_vocabsFetching] = useState(false);
  const [fetchVocabs_ERROR, SET_error] = useState<string | null>(null);
  const [vocabs, SET_vocabs] = useState<any[]>([]);
  const [totalFilteredVocab_COUNT, SET_totalVocabCount] = useState<number>(0);
  const [start, SET_start] = useState(0); // Start index for pagination
  const [end, SET_end] = useState(paginateBy); // End index for pagination
  const [IS_loadingMore, SET_loadingMore] = useState(false);

  useEffect(() => {
    SET_vocabs([]);
    SET_start(0);
    SET_end(paginateBy);
    fetchVocabs({ start: 0, end: paginateBy });
  }, [
    search,
    z_vocabDisplay_SETTINGS?.langFilters,
    z_vocabDisplay_SETTINGS?.sorting,
    z_vocabDisplay_SETTINGS?.sortDirection,
    targetList_ID,
  ]);

  const fetchPublicListIds = async () => {
    const { data, error } = await supabase
      .from("lists")
      .select("id")
      .eq("type", "public");
    if (error) {
      console.error("🔴 Error fetching list IDs: 🔴", error);
      SET_error("🔴 Error fetching lists. 🔴");
      return [];
    }
    return data?.map((list) => list.id) || [];
  };

  const fetchVocabs = async ({
    start,
    end,
  }: {
    start: number;
    end: number;
  }) => {
    if (IS_loadingMore || ARE_vocabsFetching) return;
    SET_vocabsFetching(true);
    SET_error(null);

    try {
      if (fetchByList && !targetList_ID) return;

      const list_ids = targetList_ID
        ? [targetList_ID]
        : await fetchPublicListIds();

      const query = BUILD_fetchPublicVocabsQuery({
        search,
        list_ids,
        z_vocabDisplay_SETTINGS,
        start,
        end,
      });

      await Delay(2000);
      const { data: vocabData, error: vocabError, count } = await query;

      if (vocabError) {
        console.error("🔴 Error fetching vocabs: 🔴", vocabError);
        SET_error("🔴 Error fetching vocabs. 🔴");
        return;
      }

      SET_vocabs((prev) => [...prev, ...(vocabData || [])]);
      SET_totalVocabCount(count || 0);
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
    SET_start(newStart);
    SET_end(newEnd);

    await fetchVocabs({ start: newStart, end: newEnd });
    SET_loadingMore(false);
  };

  return {
    vocabs,
    IS_loadingMore,
    fetchVocabs_ERROR,
    ARE_vocabsFetching,
    totalFilteredVocab_COUNT,
    LOAD_more,
  };
}
