//
//
//

import { useCallback, useEffect } from "react";
import { vocabFetch_TYPES } from "../../../functions/FETCH_vocabs/types";
import { USE_fetchMyVocabs } from "./USE_fetchMyVocabs/USE_fetchMyVocabs";
import { z_USE_myVocabs } from "../../zustand/z_USE_myVocabs/z_USE_myVocabs";
import { z_USE_user } from "@/src/features_new/user/hooks/z_USE_user/z_USE_user";
import { z_USE_myVocabsDisplaySettings } from "../../zustand/displaySettings/z_USE_myVocabsDisplaySettings/z_USE_myVocabsDisplaySettings";

export default function USE_controlMyVocabsFetch({
  search = "",
  fetch_TYPE = "all",
  targetList_ID = "",
}: {
  search: string;
  fetch_TYPE: vocabFetch_TYPES;
  targetList_ID: string;
}) {
  const { filters, sorting } = z_USE_myVocabsDisplaySettings();
  const { z_user } = z_USE_user();

  const {
    z_myVocabPrinted_IDS,
    z_INSERT_myVocabsError,
    z_INSERT_fetchedVocabs,
    z_PREPARE_myVocabsForFetch,
  } = z_USE_myVocabs();

  const { FETCH_myVocabs } = USE_fetchMyVocabs({
    z_INSERT_myVocabsError,
    z_INSERT_fetchedVocabs,
    z_PREPARE_myVocabsForFetch,
  });

  const FETCH = useCallback(
    async (loadMore: boolean = false) => {
      FETCH_myVocabs({
        search,
        loadMore,
        fetch_TYPE,
        targetList_ID,
        filters,
        sorting,
        user_id: z_user?.id || "",
        excludeIds: loadMore ? z_myVocabPrinted_IDS : new Set(),
      });
    },
    [filters, sorting, z_user?.id, z_myVocabPrinted_IDS, search]
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
