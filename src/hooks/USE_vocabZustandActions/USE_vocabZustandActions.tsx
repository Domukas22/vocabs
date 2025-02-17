//
//
//

import {
  vocabFetch_TYPES,
  vocabList_TYPES,
} from "@/src/features/vocabs/vocabList/USE_myVocabs/helpers/USE_fetchVocabs/helpers/FETCH_vocabs/types";
import { loadingState_TYPES } from "@/src/types/general_TYPES";
import { r_FETCH_vocabs_ARG_TYPE } from "../../features/vocabs/Vocabs_FLASHLIST/helpers/z_USE_myVocabs/z_USE_myVocabs";
import { useCallback } from "react";
import { USE_abortController } from "../USE_abortController/USE_abortController";
import { VOCAB_PAGINATION } from "@/src/constants/globalVars";

export type USE_vocabZustandActions_ARGTYPES = {
  user_id: string;
  targetList_ID?: string;
  list_TYPE: vocabList_TYPES;
  fetch_TYPE: vocabFetch_TYPES;

  search: string;
  difficultyFilters: (1 | 2 | 3)[];
  langFilters: string[];

  sortDirection: "ascending" | "descending";
  sorting: "difficulty" | "date" | "shuffle";
  FETCH_v: (args: r_FETCH_vocabs_ARG_TYPE) => Promise<void>;
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
        // amount: VOCAB_PAGINATION || 50,
        amount: 2,

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
