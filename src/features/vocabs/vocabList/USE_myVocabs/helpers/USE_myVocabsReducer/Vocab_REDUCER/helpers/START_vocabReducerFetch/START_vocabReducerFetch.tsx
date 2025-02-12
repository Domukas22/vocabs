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
  if (!state?.data?.vocabs)
    throw err("Reducer state 'data.vocabs' was undefined");

  if (!payload) throw err("'payload' was undefined");

  // If fetching additional vocabs
  // - Leave the data state alone
  // - Set loading_more
  // - Do not include error state
  if (payload === "loading_more")
    return {
      data: { ...state.data },
      loading_STATE: "loading_more",
    };

  // Else start from scratch
  return {
    data: {
      vocabs: [],
      printed_IDS: new Set(),
      unpaginated_COUNT: 0,
      HAS_reachedEnd: false,
    },
    loading_STATE: payload,
  };
}
