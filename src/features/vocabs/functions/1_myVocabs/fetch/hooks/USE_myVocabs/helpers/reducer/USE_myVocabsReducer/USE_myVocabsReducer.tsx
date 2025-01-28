//
//
//

import { useCallback, useReducer } from "react";
import {
  myVocabs_REDUCER,
  myVocabsReducerInitial_STATE,
} from "../myVocabs_REDUCER/myVocabs_REDUCER";
import Vocab_MODEL from "@/src/db/models/Vocab_MODEL";
import { loadingState_TYPES } from "@/src/types";

export default function USE_myVocabsReducer() {
  const [state, dispatch] = useReducer(
    myVocabs_REDUCER,
    myVocabsReducerInitial_STATE
  );

  const SET_loadingState = useCallback(
    (fetch_TYPE: loadingState_TYPES) =>
      dispatch({ type: "SET_LOADING_STATE", payload: fetch_TYPE }),
    []
  );
  const SET_error = useCallback(
    (err: { value: boolean; msg: string }) =>
      dispatch({ type: "SET_ERROR", payload: err }),
    []
  );
  const RESET_reducerState = useCallback(
    () => dispatch({ type: "RESET_STATE" }),
    []
  );

  const UPDATE_state = useCallback(
    (data: { vocabs: Vocab_MODEL[]; unpaginated_COUNT: number }) =>
      dispatch({ type: "UPDATE_STATE", payload: data }),
    []
  );

  const ADD_toDisplayed = useCallback(
    (vocab: Vocab_MODEL) => dispatch({ type: "ADD_VOCAB", payload: vocab }),
    [state?.loading_STATE]
  );

  const REMOVE_fromDisplayed = useCallback(
    (id: string) => dispatch({ type: "DELETE_VOCAB", payload: id }),
    [state?.loading_STATE]
  );

  return {
    state,
    UPDATE_state,
    SET_error,
    ADD_toDisplayed,
    REMOVE_fromDisplayed,
    RESET_reducerState,
    SET_loadingState,
  };
}
