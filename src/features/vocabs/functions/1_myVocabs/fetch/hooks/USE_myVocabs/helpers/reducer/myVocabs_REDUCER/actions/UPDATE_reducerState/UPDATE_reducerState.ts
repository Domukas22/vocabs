//
//
//

import Vocab_MODEL from "@/src/db/models/Vocab_MODEL";
import { myVocabsReducerState_PROPS } from "../../types";

export function UPDATE_reducerState(
  state: myVocabsReducerState_PROPS,
  payload: { vocabs: Vocab_MODEL[]; unpaginated_COUNT: number }
): myVocabsReducerState_PROPS {
  if (!state?.data?.vocabs) return state; // TODO => return error here instead of state
  if (!payload?.vocabs || typeof payload?.unpaginated_COUNT !== "number")
    return state;

  const updatedVocabs = [...state?.data?.vocabs, ...payload.vocabs];
  const updatedPrintedIds = new Set(updatedVocabs?.map((v) => v?.id));
  payload.vocabs.forEach((vocab) => updatedPrintedIds.add(vocab.id));

  return {
    ...state,
    data: {
      vocabs: updatedVocabs,
      printed_IDS: updatedPrintedIds,
      unpaginated_COUNT: payload?.unpaginated_COUNT,
      HAS_reachedEnd: updatedVocabs?.length >= payload?.unpaginated_COUNT,
    },
  };
}
