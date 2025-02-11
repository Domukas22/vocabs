//
//
//

import {
  vocabFetch_TYPES,
  vocabList_TYPES,
} from "./helpers/USE_fetchVocabsHelper/FETCH_vocabs/types";
import {
  USE_myVocabsReducer,
  USE_fetchVocabsHelper,
  USE_loadMoreVocabs,
  USE_refetchVocabs,
} from "./helpers";

export function USE_myVocabs({
  vocabFetch_TYPE,
  vocabList_TYPE,
  search,
  targetList_ID,
}: {
  vocabList_TYPE: vocabList_TYPES;
  vocabFetch_TYPE: vocabFetch_TYPES;
  search: string;
  targetList_ID?: string | undefined;
}) {
  // -----------------------------------------------------
  // This is the main part of the hook.
  // It also tracks errors for the FETCH function below.
  const {
    reducer_STATE,
    PREPEND_vocabToReducer,
    REMOVE_vocabFromReducer,
    RESET_reducerState,
    APPEND_vocabsToPagination,
    SET_reducerLoadingState,
    SET_reducerError,
  } = USE_myVocabsReducer();

  // -----------------------------------------------------
  // -----------------------------------------------------

  // Fetches vocabs and inserts them into the reducer state.
  const { FETCH } = USE_fetchVocabsHelper({
    fetch_TYPE: vocabFetch_TYPE,
    list_TYPE: vocabList_TYPE,
    reducer_STATE,
    search,
    targetList_ID,
    SET_reducerError,
    APPEND_vocabsToPagination,
    SET_reducerLoadingState,
  });

  // Adds paginated vocabs to the reducer state.
  const { LOAD_moreVocabs } = USE_loadMoreVocabs({
    reducer_STATE,
    FETCH,
  });

  // Refetches vocabs on changes ==> search / filters / sorting / targetList_ID
  USE_refetchVocabs({
    search,
    targetList_ID,
    RESET_reducerState,
    FETCH,
  });

  return {
    vocabs: reducer_STATE?.data?.vocabs,
    vocabs_ERROR: reducer_STATE?.error,
    loading_STATE: reducer_STATE?.loading_STATE,
    unpaginated_COUNT: reducer_STATE?.data?.unpaginated_COUNT,
    HAS_reachedEnd: reducer_STATE?.data?.HAS_reachedEnd,
    LOAD_moreVocabs,
    ADD_vocabToReducer: PREPEND_vocabToReducer,
    REMOVE_vocabFromReducer,
  };
}
