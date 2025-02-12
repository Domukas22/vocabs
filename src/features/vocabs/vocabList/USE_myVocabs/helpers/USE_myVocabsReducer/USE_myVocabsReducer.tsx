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
import { General_ERROR } from "@/src/types/error_TYPES";

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

  const _HANDLE_err = (err: any, function_NAME: string) => {
    const error = new General_ERROR({
      function_NAME: err?.function_NAME || function_NAME,
      message: err?.message,
      errorToSpread: err,
    });

    dispatch({
      type: "SET_error",
      payload: error,
    });
    SEND_internalError(error);
  };

  const r_START_fetch = useCallback((payload: START_fetch_PAYLOAD) => {
    if (reducer.error) return;
    try {
      dispatch({ type: "START_fetch", payload });
    } catch (error: any) {
      _HANDLE_err(error, "r_START_fetch");
    }
  }, []);

  const r_APPEND_manyVocabs = useCallback(
    (payload: APPEND_manyVocabs_PAYLOAD) => {
      if (reducer.error) return;

      try {
        dispatch({ type: "APPEND_manyVocabs", payload });
      } catch (error: any) {
        _HANDLE_err(error, "r_APPEND_manyVocabs");
      }
    },
    []
  );

  const r_PREPEND_oneVocab = useCallback(
    (payload: PREPEND_oneVocab_PAYLOAD) => {
      if (reducer.error) return;

      try {
        dispatch({ type: "PREPEND_oneVocab", payload });
      } catch (error: any) {
        _HANDLE_err(error, "r_PREPEND_oneVocab");
      }
    },
    [reducer.loading_STATE, reducer.error]
  );
  const r_UPDATE_oneVocab = useCallback(
    (payload: UPDATE_oneVocab_PAYLOAD) => {
      if (reducer.error) return;

      try {
        dispatch({ type: "UPDATE_oneVocab", payload });
      } catch (error: any) {
        _HANDLE_err(error, "r_UPDATE_oneVocab");
      }
    },
    [reducer.loading_STATE, reducer.error]
  );

  const r_DELETE_oneVocab = useCallback(
    (payload: DELETE_oneVocab_PAYLOAD) => {
      if (reducer.error) return;

      try {
        dispatch({ type: "DELETE_oneVocab", payload });
      } catch (error: any) {
        _HANDLE_err(error, "r_DELETE_oneVocab");
      }
    },
    [reducer.loading_STATE, reducer.error]
  );

  const r_SET_error = useCallback((payload: SET_error_PAYLOAD) => {
    dispatch({ type: "SET_error", payload });
    SEND_internalError(payload);
  }, []);

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
