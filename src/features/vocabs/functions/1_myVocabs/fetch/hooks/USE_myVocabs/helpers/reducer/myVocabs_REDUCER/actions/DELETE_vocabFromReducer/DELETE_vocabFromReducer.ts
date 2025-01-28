//
//
//

import { myVocabsReducerState_PROPS } from "../../types";

export function DELETE_vocabFromReducer(
  state: myVocabsReducerState_PROPS,
  payload: string
): myVocabsReducerState_PROPS {
  if (!state?.data?.vocabs) return state;
  if (!payload) return state;
  if (state.loading_STATE !== "none") return state;

  const updatedVocabs = state.data.vocabs.filter(
    (vocab) => vocab.id !== payload
  );
  const updatedPrintedIds = new Set(updatedVocabs?.map((v) => v.id));
  const totalCount = state?.data?.unpaginated_COUNT - 1;

  return {
    ...state,
    data: {
      vocabs: updatedVocabs,
      printed_IDS: updatedPrintedIds,
      unpaginated_COUNT: totalCount,
      HAS_reachedEnd: updatedVocabs?.length >= totalCount,
    },
  };
}
