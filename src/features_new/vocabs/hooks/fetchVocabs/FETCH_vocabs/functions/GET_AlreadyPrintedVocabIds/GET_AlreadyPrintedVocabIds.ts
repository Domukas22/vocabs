//
//
//

import { vocabsReducer_TYPE } from "@/src/features/vocabs/vocabList/USE_myVocabs/helpers/USE_myVocabsReducer/Vocab_REDUCER/types";
import { loadingState_TYPES } from "@/src/types/general_TYPES";

export function GET_AlreadyPrintedVocabIds(
  loadingState_TYPE: loadingState_TYPES,
  reducer: vocabsReducer_TYPE
): { alreadyPrintedVocab_IDs: Set<string> } {
  // When fetching additional vocabs that we will add to the pagination,
  // lets exclude the vocab ids that have already been printed
  return {
    alreadyPrintedVocab_IDs:
      loadingState_TYPE === "loading_more"
        ? reducer?.data?.printed_IDS || new Set()
        : new Set(),
  };
}
