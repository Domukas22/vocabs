//
//
//

import { USE_zustand } from "@/src/hooks";
import { Error_PROPS } from "@/src/props";
import { loadingState_TYPES } from "@/src/types";
import DETERMINE_searchType from "@/src/utils/DETERMINE_searchType/DETERMINE_searchType";
import { useEffect } from "react";

export default function USE_refetchVocabs({
  search,
  targetList_ID,
  RESET_reducerState,
  FETCH,
}: {
  search: string;
  targetList_ID: string | undefined;
  RESET_reducerState: () => void;
  FETCH: (fetch_TYPE: loadingState_TYPES) => Promise<null | undefined>;
}) {
  const { z_vocabDisplay_SETTINGS } = USE_zustand();
  const { difficultyFilters, langFilters, sortDirection, sorting } =
    z_vocabDisplay_SETTINGS;

  useEffect(() => {
    RESET_reducerState();

    // this will always return something, so no need to handle reducer errors here
    // + the FETCH function handles the reducer error
    const fetch_TYPE = DETERMINE_searchType({
      search,
      targetList_ID,
      difficultyFilters: difficultyFilters,
      langFilters: langFilters,
    });

    FETCH(fetch_TYPE);
  }, [
    search,
    difficultyFilters,
    langFilters,
    sortDirection,
    sorting,
    targetList_ID,
  ]);
}
