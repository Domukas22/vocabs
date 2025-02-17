//
//
//

import { General_ERROR } from "@/src/types/error_TYPES";
import { vocabsReducer_TYPE, START_fetch_PAYLOAD } from "../../types";

const function_NAME = "START_vocabReducerFetch";

const err = (message: string) => {
  return new General_ERROR({
    message,
    function_NAME,
  });
};

export function START_vocabReducerFetch(
  state: vocabsReducer_TYPE,
  payload: START_fetch_PAYLOAD
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

  // If fetching additional vocabs
  // - Leave the data state alone
  // - Set loading_more
  // - Do not include error state
  if (payload === "loading_more")
    return {
      data: { ...state.data },
      z_myVocabsLoading_STATE: "loading_more",
    };

  // Else start from scratch
  return {
    data: {
      vocabs: [],
      printed_IDS: new Set(),
      unpaginated_COUNT: 0,
      HAS_reachedEnd: false,
    },
    z_myVocabsLoading_STATE: payload,
  };
}
