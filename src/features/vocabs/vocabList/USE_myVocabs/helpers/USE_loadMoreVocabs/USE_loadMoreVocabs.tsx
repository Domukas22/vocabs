//
//
//

import { loadingState_TYPES } from "@/src/types/general_TYPES";
import { useCallback } from "react";
import { vocabsReducer_TYPE } from "../USE_myVocabsReducer/Vocab_REDUCER/types";

export function USE_loadMoreVocabs({
  reducer: state,
  FETCH_vocabsAndHanldeState = () => Promise.resolve(),
}: {
  reducer: vocabsReducer_TYPE;
  FETCH_vocabsAndHanldeState: (fetch_TYPE: loadingState_TYPES) => Promise<void>;
}) {
  const LOAD_moreVocabs = useCallback(() => {
    if (state?.loading_STATE === "none") {
      FETCH_vocabsAndHanldeState("loading_more");
    }
  }, [state]);

  return { LOAD_moreVocabs };
}
