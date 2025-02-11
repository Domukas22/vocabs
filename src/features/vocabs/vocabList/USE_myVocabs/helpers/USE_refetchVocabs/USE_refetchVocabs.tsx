//
//
//

import { USE_zustand } from "@/src/hooks";
import { loadingState_TYPES } from "@/src/types";
import DETERMINE_loadingState from "@/src/utils/DETERMINE_loadingState/DETERMINE_loadingState";
import { useEffect } from "react";

export function USE_refetchVocabs({
  search,
  targetList_ID,
  RESET_reducerState = () => {},
  FETCH = () => Promise.resolve(),
}: {
  search: string;
  targetList_ID: string | undefined;
  RESET_reducerState: () => void;
  FETCH: (loading_STATE: loadingState_TYPES) => Promise<void>;
}) {
  const { z_vocabDisplay_SETTINGS } = USE_zustand();
  const { difficultyFilters, langFilters, sortDirection, sorting } =
    z_vocabDisplay_SETTINGS;

  useEffect(() => {
    RESET_reducerState();

    // this will always return something, so no need to handle reducer errors here
    // + the FETCH function handles the reducer error
    const loading_STATE = DETERMINE_loadingState({
      search,
      targetList_ID,
      difficultyFilters: difficultyFilters,
      langFilters: langFilters,
    });

    FETCH(loading_STATE);
  }, [
    search,
    difficultyFilters,
    langFilters,
    sortDirection,
    sorting,
    targetList_ID,
  ]);
}
