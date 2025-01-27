//
//
//

import { USE_vocabs_FETCH_TYPES } from "../../FETCH_myVocabs/types";
import USE_fetchVocabsHelper from "./helpers/fetch/USE_fetchVocabsHelper/USE_fetchVocabsHelper";
import USE_refetchVocabs from "./helpers/fetch/USE_refetchVocabs/USE_refetchVocabs";
import USE_loadMoreVocabs from "./helpers/fetch/USE_loadMoreVocabs/USE_loadMoreVocabs";
import USE_myVocabsReducer from "./helpers/reducer/USE_myVocabsReducer/USE_myVocabsReducer";

export function USE_myVocabs({
  type,
  search,
  targetList_ID,
}: {
  type: USE_vocabs_FETCH_TYPES;
  search: string;
  targetList_ID?: string | undefined;
}) {
  const {
    state,
    HAS_reachedEnd,
    ADD_toDisplayed,
    REMOVE_fromDisplayed,
    RESET_reducerState,
    UPDATE_state,
    SET_loadingState,
    SET_error,
  } = USE_myVocabsReducer();

  const { FETCH } = USE_fetchVocabsHelper({
    type,
    state,
    search,
    targetList_ID,
    SET_error,
    UPDATE_state,
    SET_loadingState,
  });

  const { LOAD_moreVocabs } = USE_loadMoreVocabs({ state, FETCH });

  USE_refetchVocabs({
    search,
    targetList_ID,
    RESET_reducerState,
    FETCH,
  });

  return {
    vocabs: state.data?.vocabs,
    fetchVocabs_ERROR: state.error,
    loading_STATE: state.loading_STATE,
    unpaginated_COUNT: state.data?.unpaginated_COUNT,
    HAS_reachedEnd,
    LOAD_moreVocabs,
    ADD_toDisplayed,
    REMOVE_fromDisplayed,
  };
}
