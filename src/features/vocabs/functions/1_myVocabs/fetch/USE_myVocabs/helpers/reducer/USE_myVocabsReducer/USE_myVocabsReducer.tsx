//
//
//

import { useCallback, useEffect, useReducer } from "react";
import { myVocabs_REDUCER } from "../myVocabs_REDUCER/myVocabs_REDUCER";
import Vocab_MODEL from "@/src/db/models/Vocab_MODEL";
import { loadingState_TYPES } from "@/src/types";
import { myVocabs_REDUCER_RESPONSE_TYPE } from "../myVocabs_REDUCER/types";
import { Error_PROPS } from "@/src/props";
import { SEND_internalError } from "@/src/utils";

export const myVocabsReducerInitial_STATE: myVocabs_REDUCER_RESPONSE_TYPE = {
  data: {
    vocabs: [],
    printed_IDS: new Set(),
    unpaginated_COUNT: 0,
    HAS_reachedEnd: false,
  },
  loading_STATE: "loading",
};

export default function USE_myVocabsReducer() {
  const [reducer_STATE, dispatch] = useReducer(
    myVocabs_REDUCER,
    myVocabsReducerInitial_STATE
  );

  // log errors -----------------------------------------
  useEffect(() => {
    if (reducer_STATE?.error) {
      SEND_internalError(reducer_STATE?.error);
    }
  }, [reducer_STATE?.error]);
  // ----------------------------------------------------

  const SET_reducerLoadingState = useCallback(
    (fetch_TYPE: loadingState_TYPES) =>
      dispatch({ type: "SET_LOADING_STATE", payload: fetch_TYPE }),
    []
  );
  const SET_reducerError = useCallback(
    (err?: Error_PROPS) => dispatch({ type: "SET_ERROR", payload: err }),
    []
  );
  const RESET_reducerState = useCallback(
    () =>
      dispatch({ type: "RESET_STATE", payload: myVocabsReducerInitial_STATE }),
    []
  );

  const APPEND_vocabsToPagination = useCallback(
    (data: { vocabs: Vocab_MODEL[]; unpaginated_COUNT: number }) =>
      dispatch({ type: "ADD_VOCABS_TO_PAGINATION", payload: data }),
    []
  );

  const PREPEND_vocabToReducer = useCallback(
    (vocab: Vocab_MODEL) => dispatch({ type: "ADD_VOCAB", payload: vocab }),
    [reducer_STATE?.loading_STATE]
  );

  const REMOVE_vocabFromReducer = useCallback(
    (id: string) => dispatch({ type: "DELETE_VOCAB", payload: id }),
    [reducer_STATE?.loading_STATE]
  );

  return {
    reducer_STATE,
    SET_reducerLoadingState,
    PREPEND_vocabToReducer,
    APPEND_vocabsToPagination,
    REMOVE_vocabFromReducer,
    SET_reducerError,
    RESET_reducerState,
  };
}
