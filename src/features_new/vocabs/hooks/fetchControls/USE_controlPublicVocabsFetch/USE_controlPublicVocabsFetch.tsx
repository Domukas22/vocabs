//
//
//

import { USE_zustand } from "@/src/hooks";
import { useCallback, useEffect } from "react";
import { USE_fetchPublicVocabs } from "./USE_fetchPublicVocabs/USE_fetchPublicVocabs";
import { z_USE_publicVocabs } from "../../zustand/z_USE_publicVocabs/z_USE_publicVocabs";
import { vocabFetch_TYPES } from "../../../functions/FETCH_vocabs/types";

export default function USE_controlPublicVocabsFetch({
  search = "",
  fetch_TYPE = "all",
  targetList_ID = "",
}: {
  search: string;
  fetch_TYPE: vocabFetch_TYPES;
  targetList_ID: string;
}) {
  const { z_vocabDisplay_SETTINGS } = USE_zustand();

  const { langFilters, sortDirection } = z_vocabDisplay_SETTINGS;

  const {
    z_publicVocabPrinted_IDS,
    z_INSERT_publicVocabsError,
    z_INSERT_fetchedVocabs,
    z_PREPARE_publicVocabsForFetch,
  } = z_USE_publicVocabs();

  const { FETCH_publicVocabs } = USE_fetchPublicVocabs({
    z_INSERT_publicVocabsError,
    z_INSERT_fetchedVocabs,
    z_PREPARE_publicVocabsForFetch,
  });

  const FETCH = useCallback(
    async (loadMore: boolean = false) => {
      FETCH_publicVocabs({
        search,
        loadMore,
        fetch_TYPE,
        targetList_ID,
        langFilters,
        sortDirection,
        excludeIds: loadMore ? z_publicVocabPrinted_IDS : new Set(),
      });
    },
    [
      langFilters,
      sortDirection,
      z_publicVocabPrinted_IDS,
      search,
      targetList_ID,
    ]
  );

  // Refetch on search / sorting / filter / targetList_ID
  useEffect(() => {
    (async () => await FETCH())();
  }, [search, langFilters, sortDirection, targetList_ID]);

  const LOAD_more = useCallback(async () => {
    (async () => await FETCH(true))();
  }, [FETCH]);

  return { LOAD_more };
}
