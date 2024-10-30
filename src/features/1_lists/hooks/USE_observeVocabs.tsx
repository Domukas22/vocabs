import { useEffect, useState } from "react";
import { Vocabs_DB } from "@/src/db";
import { Q } from "@nozbe/watermelondb";
import FetchVocabs_QUERY from "../../2_vocabs/utils/FetchVocabs_QUERY";
import { Vocab_MODEL } from "@/src/db/watermelon_MODELS";
import { z_vocabDisplaySettings_PROPS } from "@/src/zustand";

export default function USE_observedVocabs({
  search,
  user_id,
  list_id,
  z_vocabDisplay_SETTINGS,
  fetchAll = false,
  paginateBy = 10,
}: {
  search: string;
  list_id?: string | undefined;
  user_id?: string | undefined;
  z_vocabDisplay_SETTINGS: z_vocabDisplaySettings_PROPS | undefined;
  fetchAll?: boolean;
  paginateBy: number;
}) {
  const [vocabs, SET_vocabs] = useState<Vocab_MODEL[]>([]);
  const [ARE_vocabsFetching, SET_vocabsFetching] = useState(false);
  const [fetchVocabs_ERROR, SET_error] = useState<string | null>(null);
  const [start, SET_start] = useState(0);
  const [IS_loadingMore, SET_loadingMore] = useState(false);
  const [HAS_reachedEnd, SET_hasReachedEnd] = useState(false);

  useEffect(() => {
    // Reset pagination when search, list_id, or other filters change
    SET_vocabs([]);
    SET_start(0);
    fetchVocabs({ _start: 0, _end: paginateBy });
    SET_hasReachedEnd(false);
  }, [search, list_id, z_vocabDisplay_SETTINGS, paginateBy]);

  const fetchVocabs = async ({ _start }: { _start: number }) => {
    if (!list_id && !fetchAll) {
      SET_error("🔴 List ID is required unless fetching all vocabs. 🔴");
      SET_vocabs([]);
      return;
    }

    SET_vocabsFetching(true);
    SET_error(null);

    try {
      const queries = FetchVocabs_QUERY({
        search,
        list_id,
        user_id,
        z_vocabDisplay_SETTINGS,
        fetchAll,
        start: _start,
        amount: paginateBy,
      });

      // Pagination implementation with WatermelonDB
      const paginatedQuery = queries.observe();

      const subscription = paginatedQuery.subscribe({
        next: (updated_VOCABS) => {
          if (updated_VOCABS.length < paginateBy) {
            SET_hasReachedEnd(true);
          }

          SET_vocabs((prev) => [...prev, ...updated_VOCABS]);
        },

        error: (error) => {
          console.error("🔴 Error fetching vocabs from WatermelonDB:", error);
          SET_error("🔴 Error fetching vocabs for the list. 🔴");
        },
      });

      return () => subscription.unsubscribe(); // Clean up subscription
    } catch (error) {
      console.error("🔴 Unexpected error fetching vocabs for the list:", error);
      SET_error("🔴 Unexpected error occurred. 🔴");
    } finally {
      SET_vocabsFetching(false);
    }
  };

  const LOAD_more = async () => {
    if (HAS_reachedEnd) return;

    const newStart = start + paginateBy;
    SET_loadingMore(true);
    SET_start(newStart);

    await fetchVocabs({ _start: newStart });
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
