//
//
//

import {
  vocabFetch_TYPES,
  itemVisibility_TYPE,
} from "@/src/features_new/vocabs/hooks/fetchVocabs/FETCH_vocabs/types";
import { useCallback } from "react";
import { USE_abortController } from "../../../../hooks/USE_abortController/USE_abortController";
import { VOCAB_PAGINATION } from "@/src/constants/globalVars";
import { z_FETCH_vocabsArgument_TYPES } from "../zustand/z_USE_myVocabs/z_USE_myVocabs";

export type USE_vocabZustandActions_ARGTYPES = {
  user_id: string;
  targetList_ID?: string;
  list_TYPE: itemVisibility_TYPE;
  fetch_TYPE: vocabFetch_TYPES;

  search: string;
  difficultyFilters: (1 | 2 | 3)[];
  langFilters: string[];

  sortDirection: "ascending" | "descending";
  sorting: "difficulty" | "date" | "shuffle";
  FETCH_v: (args: z_FETCH_vocabsArgument_TYPES) => Promise<void>;
};

export function USE_vocabZustandActions(
  args: USE_vocabZustandActions_ARGTYPES
) {
  const {
    search,
    difficultyFilters,
    langFilters,
    sortDirection,
    sorting,
    user_id,
    targetList_ID,
    fetch_TYPE,
    list_TYPE,
    FETCH_v = () => Promise.resolve(),
  } = args;

  const { START_newRequest } = USE_abortController();
  const FETCH_vocabs = useCallback(
    async (loadMore: boolean = false) => {
      const newController = START_newRequest();
      await FETCH_v({
        search,
        difficultyFilters,
        langFilters,
        sortDirection,
        sorting,
        user_id,
        list_id: targetList_ID || "",
        amount: VOCAB_PAGINATION,
        // amount: 2,

        fetch_TYPE,
        list_TYPE,
        signal: newController.signal,

        loadMore,
      });
    },
    [
      search,
      difficultyFilters,
      langFilters,
      sortDirection,
      sorting,
      user_id,
      targetList_ID,
    ]
  );

  return { FETCH_vocabs };
}
