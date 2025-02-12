//
//
//

import { USE_zustand } from "@/src/hooks";
import { loadingState_TYPES } from "@/src/types/general_TYPES";
import DETERMINE_loadingState from "@/src/utils/DETERMINE_loadingState/DETERMINE_loadingState";
import { useEffect } from "react";
import {
  vocabFetch_TYPES,
  vocabList_TYPES,
} from "../USE_fetchVocabs/helpers/FETCH_vocabs/types";

export function USE_refetchVocabs({
  search = "",
  targetList_ID = "",
  REFETCH_vocabs = () => Promise.resolve(),
}: {
  search: string;
  targetList_ID: string | undefined;
  REFETCH_vocabs: (loading_STATE: loadingState_TYPES) => Promise<void>;
}) {
  const { z_vocabDisplay_SETTINGS } = USE_zustand();
  const { difficultyFilters, langFilters, sortDirection, sorting } =
    z_vocabDisplay_SETTINGS;

  useEffect(() => {
    // this will always return something, so no need to handle reducer errors here
    // + the REFETCH_vocabs function handles the reducer error
    const loading_STATE = DETERMINE_loadingState({
      search,
      targetList_ID,
      difficultyFilters,
      langFilters,
    });

    REFETCH_vocabs(loading_STATE);
  }, [
    search,
    difficultyFilters,
    langFilters,
    sortDirection,
    sorting,
    targetList_ID,
  ]);
}
