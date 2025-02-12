//
//
//

import {
  FETCH_myVocabs_RESPONSE_TYPE,
  vocabFetch_TYPES,
  vocabList_TYPES,
} from "./helpers/USE_fetchVocabs/helpers/FETCH_vocabs/types";
import {
  USE_myVocabsReducer,
  USE_fetchVocabs,
  USE_loadMoreVocabs,
  USE_refetchVocabs,
  USE_fetchVocabsAndHanldeState,
} from "./helpers";
import { loadingState_TYPES } from "@/src/types/general_TYPES";
import { vocabsReducer_TYPE } from "./helpers/USE_myVocabsReducer/Vocab_REDUCER/types";
import { useCallback } from "react";
import { General_ERROR } from "@/src/types/error_TYPES";
import { USE_vocabReducerActions } from "./helpers/USE_vocabReducerActions/USE_vocabReducerActions";

interface USE_myVocabs_ARGS {
  list_TYPE: vocabList_TYPES;
  fetch_TYPE: vocabFetch_TYPES;
  search: string;
  targetList_ID?: string | undefined;
}

export function USE_myVocabs(args: USE_myVocabs_ARGS) {
  const { search, targetList_ID, list_TYPE, fetch_TYPE } = args;
  const {
    reducer,
    r_PREPEND_oneVocab,
    r_DELETE_oneVocab,
    r_START_fetch,
    r_APPEND_manyVocabs,
    r_UPDATE_oneVocab,
    r_SET_error,
  } = USE_myVocabsReducer();

  // This hook simply interracts with the 'r_' functions
  const { LOAD_moreVocabs, REFETCH_vocabs } = USE_vocabReducerActions({
    reducer,
    list_TYPE,
    fetch_TYPE,
    search,
    targetList_ID,
    r_START_fetch,
    r_APPEND_manyVocabs,
    r_SET_error,
  });

  // This triggers the "REFETCH_vocabs"
  // on changes ==> search / filters / sorting / targetList_ID
  USE_refetchVocabs({
    search,
    targetList_ID,
    REFETCH_vocabs,
  });

  return {
    vocabs: reducer?.data?.vocabs,
    vocabs_ERROR: reducer?.error,
    loading_STATE: reducer?.loading_STATE,
    unpaginated_COUNT: reducer?.data?.unpaginated_COUNT,
    HAS_reachedEnd: reducer?.data?.HAS_reachedEnd,
    LOAD_moreVocabs,
    r_PREPEND_oneVocab,
    r_DELETE_oneVocab,
    r_UPDATE_oneVocab,
  };
}
