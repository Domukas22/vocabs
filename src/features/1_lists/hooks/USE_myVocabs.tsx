import { useEffect, useMemo, useState } from "react";
import FetchVocabs_QUERY from "../../2_vocabs/utils/FetchVocabs_QUERY";
import { Vocab_MODEL } from "@/src/db/watermelon_MODELS";
import { z_vocabDisplaySettings_PROPS } from "@/src/zustand";
import Delay from "@/src/utils/Delay";

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
  const [printed_IDS, SET_printedIds] = useState(new Set<string>());
  const [initialFetch, SET_initialFetch] = useState(false);

  const HAS_reachedEnd = useMemo(
    () => vocabs.length >= totalFilteredVocab_COUNT,
    [vocabs, totalFilteredVocab_COUNT]
  );

  useEffect(() => {
    resetVocabs();
    fetchVocabs({ printed: new Set<string>(), resetTotal: true });
  }, [search, list_id, z_vocabDisplay_SETTINGS]);

  const resetVocabs = () => {
    SET_vocabs([]);
    SET_printedIds(new Set<string>());
    SET_totalVocabCount(0);
  };

  const fetchVocabs = async ({
    printed = new Set<string>(),
    resetTotal = false,
  }: {
    printed: Set<string>;
    resetTotal?: boolean;
  }) => {
    // await Delay(5000);

    if (!list_id && !fetchAll) {
      SET_error("🔴 List ID is required unless fetching all vocabs. 🔴");
      SET_vocabs([]);
      return;
    }

    SET_vocabsFetching(true);
    SET_error(null);

    try {
      if (resetTotal) await EDIT_filteredVocabCount();
      const new_VOCABS = await GET_vocabs(printed);

      new_VOCABS.forEach((vocab) => {
        SET_printedIds((prev) => new Set(prev).add(vocab.id));
      });

      SET_vocabs((prev) => [...prev, ...new_VOCABS]);
    } catch (error) {
      console.error("🔴 Unexpected error fetching vocabs:", error);
      SET_error("🔴 Unexpected error occurred. 🔴");
    } finally {
      SET_vocabsFetching(false);
      if (!initialFetch) {
        SET_initialFetch(true);
        setTimeout(() => {
          // this prevents the page from ficking at the beginning
          // if you remove this, each time you navigate to a page which uses this hook, the flatlist with jumo down very quickly at the beginnig
          // this has something to do with the flashlist component
        }, 0);
      }
    }
  };

  const GET_vocabs = async (printed: Set<string>) => {
    const queries = FetchVocabs_QUERY({
      search,
      list_id,
      user_id,
      z_vocabDisplay_SETTINGS,
      fetchAll,
      excludeIds: printed,
      amount: paginateBy,
    });
    return await queries.fetch();
  };

  const EDIT_filteredVocabCount = async () => {
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
  };

  const LOAD_more = async () => {
    if (HAS_reachedEnd) return;
    SET_loadingMore(true);

    await fetchVocabs({ printed: printed_IDS });
    SET_loadingMore(false);
  };

  const ADD_toDisplayed = (vocab: Vocab_MODEL) => {
    SET_vocabs((prev) => [vocab, ...prev]);
    SET_printedIds((prev) => new Set(prev).add(vocab.id));
  };

  const REMOVE_fromDisplayed = (id: string) => {
    SET_vocabs((prev) => prev.filter((x) => x.id !== id));
    SET_printedIds((prev) => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
    EDIT_filteredVocabCount();
  };

  return {
    vocabs,
    IS_loadingMore,
    HAS_reachedEnd,
    fetchVocabs_ERROR,
    ARE_vocabsFetching,
    totalFilteredVocab_COUNT,
    LOAD_more,
    ADD_toDisplayed,
    REMOVE_fromDisplayed,
    initialFetch,
  };
}
