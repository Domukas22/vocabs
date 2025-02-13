//
//
//

import { useCallback, useEffect, useReducer } from "react";
import { SEND_internalError } from "@/src/utils";
import {
  APPEND_manyVocabs_PAYLOAD,
  DELETE_oneVocab_PAYLOAD,
  vocabsReducer_TYPE,
  PREPEND_oneVocab_PAYLOAD,
  SET_error_PAYLOAD,
  START_fetch_PAYLOAD,
  UPDATE_oneVocab_PAYLOAD,
} from "./Vocab_REDUCER/types";
import { Vocab_REDUCER } from "./Vocab_REDUCER/Vocab_REDUCER";

export const myVocabsReducerInitial_STATE: vocabsReducer_TYPE = {
  data: {
    vocabs: [],
    printed_IDS: new Set(),
    unpaginated_COUNT: 0,
    HAS_reachedEnd: false,
  },
  loading_STATE: "loading",
};

export function USE_myVocabsReducer() {
  const [reducer, dispatch] = useReducer(
    Vocab_REDUCER,
    myVocabsReducerInitial_STATE
  );

  const r_START_fetch = useCallback((payload: START_fetch_PAYLOAD) => {
    dispatch({ type: "START_fetch", payload });
  }, []);

  const r_APPEND_manyVocabs = useCallback(
    (payload: APPEND_manyVocabs_PAYLOAD) => {
      dispatch({ type: "APPEND_manyVocabs", payload });
    },
    []
  );
  const r_PREPEND_oneVocab = useCallback(
    (payload: PREPEND_oneVocab_PAYLOAD) => {
      dispatch({ type: "PREPEND_oneVocab", payload });
    },
    [reducer.loading_STATE]
  );
  const r_UPDATE_oneVocab = useCallback(
    (payload: UPDATE_oneVocab_PAYLOAD) => {
      dispatch({ type: "UPDATE_oneVocab", payload });
    },
    [reducer.loading_STATE]
  );

  const r_DELETE_oneVocab = useCallback(
    (payload: DELETE_oneVocab_PAYLOAD) => {
      dispatch({ type: "DELETE_oneVocab", payload });
    },
    [reducer.loading_STATE]
  );

  const r_SET_error = useCallback((payload: SET_error_PAYLOAD) => {
    dispatch({ type: "SET_error", payload });
  }, []);

  // ---------------------------------
  // Log internal errors
  useEffect(() => {
    if (reducer.error) SEND_internalError(reducer.error);
  }, [reducer.error]);
  // ---------------------------------

  return {
    reducer,
    r_PREPEND_oneVocab,
    r_UPDATE_oneVocab,
    r_DELETE_oneVocab,
    r_START_fetch,
    r_APPEND_manyVocabs,
    r_SET_error,
  };
}
