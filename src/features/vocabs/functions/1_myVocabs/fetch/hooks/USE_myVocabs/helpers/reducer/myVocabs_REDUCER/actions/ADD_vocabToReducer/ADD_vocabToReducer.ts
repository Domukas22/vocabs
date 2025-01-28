//
//
//

import Vocab_MODEL from "@/src/db/models/Vocab_MODEL";
import { myVocabsReducerState_PROPS } from "../../types";

export function ADD_vocabToReducer(
  state: myVocabsReducerState_PROPS,
  payload: Vocab_MODEL
): myVocabsReducerState_PROPS {
  if (!state?.data?.vocabs) return state; // TODO --> return error instead of state
  if (!payload?.id) return state;
  if (state.loading_STATE !== "none") return state;

  const newVocabs = [payload, ...state?.data?.vocabs];
  const updatedIds = new Set(newVocabs?.map((v) => v?.id));
  updatedIds.add(payload?.id);
  const totalCount = state?.data?.unpaginated_COUNT + 1;

  return {
    ...state,
    data: {
      vocabs: newVocabs,
      printed_IDS: updatedIds,
      unpaginated_COUNT: totalCount,
      HAS_reachedEnd: newVocabs?.length >= totalCount,
    },
  };
}
