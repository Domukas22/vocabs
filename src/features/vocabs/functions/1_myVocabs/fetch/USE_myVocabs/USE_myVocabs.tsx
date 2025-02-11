//
//
//

import { USE_vocabs_FETCH_TYPES } from "../FETCH_myVocabs/types";
import USE_fetchVocabsHelper from "./helpers/fetch/USE_fetchVocabsHelper/USE_fetchVocabsHelper";
import USE_refetchVocabs from "./helpers/fetch/USE_refetchVocabs/USE_refetchVocabs";
import USE_loadMoreVocabs from "./helpers/fetch/USE_loadMoreVocabs/USE_loadMoreVocabs";
import USE_myVocabsReducer from "./helpers/reducer/USE_myVocabsReducer/USE_myVocabsReducer";

export function USE_myVocabs({
  vocabFetch_TYPE,
  search,
  targetList_ID,
}: {
  vocabFetch_TYPE: USE_vocabs_FETCH_TYPES;
  search: string;
  targetList_ID?: string | undefined;
}) {
  // -----------------------------------------------------
  // the main part of the hook
  // tracks errors for teh FETCH function below as well
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

  // fetches vocabs and insters them into the reducer state
  const { FETCH } = USE_fetchVocabsHelper({
    type: vocabFetch_TYPE,
    reducer_STATE,
    search,
    targetList_ID,
    SET_reducerError,
    APPEND_vocabsToPagination,
    SET_reducerLoadingState,
  });

  // adds paginated vocabs to the reducer state
  const { LOAD_moreVocabs } = USE_loadMoreVocabs({
    reducer_STATE,
    FETCH,
  });

  // refetches vocabs on changes: search / filters / sorting / targetList_ID
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
