//
//
//

import {
  vocabsReducer_TYPE,
  myVocabsReducerAction_PROPS,
  START_fetch_PAYLOAD,
  UPDATE_oneVocab_PAYLOAD,
} from "./types";

import {
  PREPEND_oneVocabToReducer,
  DELETE_vocabFromReducer,
  SET_reducerError,
  APPEND_manyVocabsToReducer,
  UPDATE_oneVocabInReducer,
  START_vocabReducerFetch,
} from "./helpers";

import { General_ERROR } from "@/src/types/error_TYPES";

///////////////////////////////////////////////////////////////////

export function Vocab_REDUCER(
  state: vocabsReducer_TYPE,
  action: myVocabsReducerAction_PROPS
): vocabsReducer_TYPE {
  try {
    switch (action.type) {
      case "START_fetch":
        return START_vocabReducerFetch(state, action.payload);

      case "APPEND_manyVocabs":
        return APPEND_manyVocabsToReducer(state, action.payload);

      case "PREPEND_oneVocab":
        return PREPEND_oneVocabToReducer(state, action.payload);

      case "UPDATE_oneVocab":
        return UPDATE_oneVocabInReducer(state, action.payload);

      case "DELETE_oneVocab":
        return DELETE_vocabFromReducer(state, action.payload);

      case "SET_error":
        return SET_reducerError(action.payload);

      default:
        return state;
    }
  } catch (error: any) {
    return {
      error: new General_ERROR({
        function_NAME: error?.function_NAME || "Vocab_REDUCER",
        message: error?.message,
        errorToSpread: error,
      }),
      loading_STATE: "error",
    };
  }
}
