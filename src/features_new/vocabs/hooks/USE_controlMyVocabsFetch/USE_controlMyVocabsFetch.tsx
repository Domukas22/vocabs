//
//
//

import { USE_zustand } from "@/src/hooks";
import { useCallback, useEffect } from "react";
import { myVocabFetch_TYPES } from "../USE_fetchVocabs/FETCH_vocabs/types";
import { USE_fetchMyVocabs } from "../USE_fetchVocabs/USE_fetchMyVocabs";
import { z_USE_myVocabs } from "../zustand/z_USE_myVocabs/z_USE_myVocabs";

export default function USE_controlMyVocabsFetch({
  search = "",
  fetch_TYPE = "all",
  targetList_ID = "",
}: {
  search: string;
  fetch_TYPE: myVocabFetch_TYPES;
  targetList_ID: string;
}) {
  const { FETCH_myVocabs } = USE_fetchMyVocabs();
  const { z_user, z_vocabDisplay_SETTINGS } = USE_zustand();
  const { difficultyFilters, langFilters, sortDirection, sorting } =
    z_vocabDisplay_SETTINGS;
  const { z_myVocabPrinted_IDS } = z_USE_myVocabs();

  const FETCH = useCallback(
    async (loadMore: boolean = false) => {
      FETCH_myVocabs({
        search,
        loadMore,
        fetch_TYPE,
        targetList_ID,
        difficultyFilters,
        langFilters,
        sortDirection,
        sorting,
        user_id: z_user?.id || "",
        excludeIds: loadMore ? z_myVocabPrinted_IDS : new Set(),
      });
    },
    [
      difficultyFilters,
      langFilters,
      sortDirection,
      sorting,
      z_user?.id,
      z_myVocabPrinted_IDS,
      search,
    ]
  );

  // Refetch on search / sorting / filter / targetList_ID
  useEffect(() => {
    (async () => await FETCH())();
  }, [
    search,
    difficultyFilters,
    langFilters,
    sortDirection,
    sorting,
    targetList_ID,
  ]);

  const LOAD_more = useCallback(async () => {
    (async () => await FETCH(true))();
  }, []);

  return { LOAD_more };
}
