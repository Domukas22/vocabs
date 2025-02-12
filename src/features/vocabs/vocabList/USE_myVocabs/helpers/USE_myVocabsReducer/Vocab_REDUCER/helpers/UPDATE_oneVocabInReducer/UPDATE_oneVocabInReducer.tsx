//
//
//

import { General_ERROR } from "@/src/types/error_TYPES";
import { vocabsReducer_TYPE, UPDATE_oneVocab_PAYLOAD } from "../../types";

const function_NAME = "UPDATE_oneVocabInReducer";

const err = (message: string) => {
  return new General_ERROR({
    message,
    function_NAME,
  });
};

export function UPDATE_oneVocabInReducer(
  state: vocabsReducer_TYPE,
  payload: UPDATE_oneVocab_PAYLOAD
): vocabsReducer_TYPE {
  // check if the CURRENT STATE has a valid vocab array
  if (!state?.data?.vocabs)
    throw err("Reducer state 'data.vocabs' was undefined");

  // check if the CURRENT STATE has a valid unpaginated count
  if (typeof state?.data?.unpaginated_COUNT !== "number")
    throw err("Reducer state 'payload.unpaginated_COUNT' was not a number");

  // check if the PAYLOAD has a valid vocab id
  if (!payload?.id) throw err("Reducer state 'payload.id' was undefined");

  // If the vocab isnt inside the printed ids, return early
  if (!state.data.printed_IDS.has(payload.id)) return state;

  // Find and replace the target vocab
  const newVocabs = state?.data?.vocabs.map((v) => {
    if (v.id === payload?.id) return payload;
    return v;
  });

  return {
    data: {
      vocabs: newVocabs,
      printed_IDS: state.data?.printed_IDS,
      unpaginated_COUNT: state.data?.unpaginated_COUNT,
      HAS_reachedEnd: state.data?.HAS_reachedEnd,
    },
    loading_STATE: "none",
  };
}
