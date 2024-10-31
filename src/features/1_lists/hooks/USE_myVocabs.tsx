import { useEffect, useMemo, useState } from "react";
import FetchVocabs_QUERY from "../../2_vocabs/utils/FetchVocabs_QUERY";
import { Vocab_MODEL } from "@/src/db/watermelon_MODELS";
import { z_vocabDisplaySettings_PROPS } from "@/src/zustand";

export default function USE_myVocabs({
  search,
  user_id,
  list_id,
  z_vocabDisplay_SETTINGS,
  fetchAll = false,
  paginateBy = 10,
}: {
  search: string;
  list_id?: string;
  user_id?: string;
  z_vocabDisplay_SETTINGS: z_vocabDisplaySettings_PROPS | undefined;
  fetchAll?: boolean;
  paginateBy: number;
}) {
  const [vocabs, SET_vocabs] = useState<Vocab_MODEL[]>([]);
  const [totalFilteredVocab_COUNT, SET_totalVocabCount] = useState<number>(0);
  const [ARE_vocabsFetching, SET_vocabsFetching] = useState(false);
  const [fetchVocabs_ERROR, SET_error] = useState<string | null>(null);
  const [IS_loadingMore, SET_loadingMore] = useState(false);
  const [printed_IDS, SET_printedIds] = useState(new Set<string>()); // Use array instead of Set

  const HAS_reachedEnd = useMemo(
    () => vocabs?.length >= totalFilteredVocab_COUNT,
    [vocabs, totalFilteredVocab_COUNT]
  );

  useEffect(() => {
    // Reset printed IDs and vocabs when filters change
    SET_printedIds(new Set<string>()); // Reset as an empty array
    SET_vocabs([]);
    fetchVocabs({ printed: new Set<string>(), resetTotal: true });
  }, [search, list_id, z_vocabDisplay_SETTINGS]);

  const fetchVocabs = async ({
    printed = new Set<string>(),
    resetTotal = false,
  }: {
    printed: Set<string>;
    resetTotal?: boolean;
  }) => {
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
        excludeIds: printed, // Convert array to Set for filtering
        amount: paginateBy,
      });
      const new_VOCABS = await queries.fetch();

      if (resetTotal) {
        const countQuery = FetchVocabs_QUERY({
          search,
          list_id,
          user_id,
          z_vocabDisplay_SETTINGS,
          fetchAll,
          fetchOnlyForCount: true,
        });

        const total = await countQuery.fetchCount();
        SET_totalVocabCount(total);
      }

      // Append new vocab IDs to printed_IDS
      new_VOCABS.forEach((vocab) =>
        SET_printedIds((prev) => prev.add(vocab.id))
      );

      // Update vocabs state
      SET_vocabs((prev) => [...prev, ...new_VOCABS]);
    } catch (error) {
      console.error("🔴 Unexpected error fetching vocabs:", error);
      SET_error("🔴 Unexpected error occurred. 🔴");
    } finally {
      SET_vocabsFetching(false);
    }
  };

  const LOAD_more = async () => {
    if (HAS_reachedEnd) return;
    SET_loadingMore(true);
    await fetchVocabs({ printed: printed_IDS });
    SET_loadingMore(false);
  };

  return {
    vocabs,
    totalFilteredVocab_COUNT,
    HAS_reachedEnd,
    ARE_vocabsFetching,
    fetchVocabs_ERROR,
    LOAD_more,
    IS_loadingMore,
  };
}
