//
//
//

import { loadingState_TYPES } from "@/src/types/general_TYPES";
import {
  vocabList_TYPES,
  vocabFetch_TYPES,
  FETCH_myVocabs_RESPONSE_TYPE,
} from "../USE_fetchVocabs/helpers/FETCH_vocabs/types";
import { USE_fetchVocabs } from "../USE_fetchVocabs/USE_fetchVocabs";
import { USE_fetchVocabsAndHanldeState } from "../USE_fetchVocabsAndHanldeState/USE_fetchVocabsAndHanldeState";
import { USE_loadMoreVocabs } from "../USE_loadMoreVocabs/USE_loadMoreVocabs";
import { vocabsReducer_TYPE } from "../USE_myVocabsReducer/Vocab_REDUCER/types";

export function USE_vocabReducerActions({
  reducer,
  list_TYPE,
  fetch_TYPE,
  search,
  targetList_ID,
  r_START_fetch,
  r_APPEND_manyVocabs,
  r_SET_error,
}: {
  reducer: vocabsReducer_TYPE;
  list_TYPE: vocabList_TYPES;
  fetch_TYPE: vocabFetch_TYPES;
  search: string;
  targetList_ID?: string | undefined;
  r_START_fetch: (loadingState_TYPE: loadingState_TYPES) => void;
  r_APPEND_manyVocabs: (data: FETCH_myVocabs_RESPONSE_TYPE) => void;
  r_SET_error: (error: any) => void;
}) {
  const { FETCH: FETCH_vocabs } = USE_fetchVocabs({
    reducer,
    list_TYPE,
    fetch_TYPE,
    search,
    targetList_ID,
  });

  // Fetches vocabs and updates reducer state
  const { FETCH_vocabsAndHanldeState } = USE_fetchVocabsAndHanldeState({
    FETCH_vocabs,
    r_START_fetch,
    r_APPEND_manyVocabs,
    r_SET_error,
  });

  // This just triggers the "FETCH_vocabsAndHanldeState"
  // It loads additional vocabs
  const { LOAD_moreVocabs } = USE_loadMoreVocabs({
    reducer,
    FETCH_vocabsAndHanldeState,
  });

  return { LOAD_moreVocabs, REFETCH_vocabs: FETCH_vocabsAndHanldeState };
}
