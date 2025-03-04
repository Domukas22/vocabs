//
//
//

import { USE_zustand } from "@/src/hooks";
import { useCallback, useEffect } from "react";
import { USE_fetchPublicVocabs } from "./USE_fetchPublicVocabs/USE_fetchPublicVocabs";
import { z_USE_publicVocabs } from "../../zustand/z_USE_publicVocabs/z_USE_publicVocabs";
import { vocabFetch_TYPES } from "../../../functions/FETCH_vocabs/types";
import { z_USE_myVocabsDisplaySettings } from "../../zustand/displaySettings/z_USE_myVocabsDisplaySettings/z_USE_myVocabsDisplaySettings";
import { z_USE_publicVocabsDisplaySettings } from "../../zustand/displaySettings/z_USE_publicVocabsDisplaySettings/z_USE_publicVocabsDisplaySettings";

export default function USE_controlPublicVocabsFetch({
  search = "",
  fetch_TYPE = "all",
  targetList_ID = "",
}: {
  search: string;
  fetch_TYPE: vocabFetch_TYPES;
  targetList_ID: string;
}) {
  const { filters, sorting } = z_USE_publicVocabsDisplaySettings();

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
        excludeIds: loadMore ? z_publicVocabPrinted_IDS : new Set(),
        filters,
        sorting,
      });
    },
    [sorting, filters, z_publicVocabPrinted_IDS, search, targetList_ID]
  );

  // Refetch on search / sorting / filter / targetList_ID
  useEffect(() => {
    (async () => await FETCH())();
  }, [search, filters, sorting, targetList_ID]);

  const LOAD_more = useCallback(async () => {
    (async () => await FETCH(true))();
  }, [FETCH]);

  return { LOAD_more };
}
