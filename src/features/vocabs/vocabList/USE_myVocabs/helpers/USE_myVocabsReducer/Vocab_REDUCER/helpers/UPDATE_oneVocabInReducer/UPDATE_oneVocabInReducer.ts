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
  if (!state) throw err("Reducer 'state' was undefined");

  if (!state.data) throw err("Reducer 'state.data' was undefined");

  if (!state.data.vocabs)
    throw err("Reducer 'state.data.vocabs' was undefined");

  if (!state.data.printed_IDS)
    throw err("Reducer 'state.data.printed_IDS' was undefined");

  if (typeof state.data.unpaginated_COUNT !== "number")
    throw err("Reducer 'state.data.unpaginated_COUNT' was not a number");

  if (typeof state.data.HAS_reachedEnd !== "boolean")
    throw err("Reducer 'state.data.HAS_reachedEnd' was not a boolean");

  if (!payload) throw err("Reducer 'payload' was undefined");

  if (!payload.id) throw err("Reducer 'payload.id' was undefined");

  // Find and replace the target vocab
  const newVocabs = state.data.vocabs.map((v) => {
    if (!v.id)
      throw err("A vocab inside 'state.data.vocabs' did not have an id");
    if (v.id === payload.id) return payload;
    return v;
  });

  return {
    data: {
      vocabs: newVocabs,
      printed_IDS: state.data.printed_IDS,
      unpaginated_COUNT: state.data.unpaginated_COUNT,
      HAS_reachedEnd: state.data.HAS_reachedEnd,
    },
    z_myVocabsLoading_STATE: "none",
  };
}
