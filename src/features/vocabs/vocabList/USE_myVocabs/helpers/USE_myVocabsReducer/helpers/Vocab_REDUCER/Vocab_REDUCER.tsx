//
//
//

import {
  internalErrMsg_TYPES,
  myVocabs_REDUCER_ERRORS,
  myVocabs_REDUCER_RESPONSE_TYPE,
  myVocabsReducerAction_PROPS,
} from "./types";

import {
  ADD_vocabToReducer,
  DELETE_vocabFromReducer,
  SET_reducerError,
  SET_reducerLoadingState,
  ADD_newPaginatedVocabsToReducerState,
} from "./actions";
import { Error_PROPS } from "@/src/props";

///////////////////////////////////////////////////////////////////

export type CREATE_err_TYPE = (
  type: internalErrMsg_TYPES,
  function_NAME: string
) => Error_PROPS;

function CREATE_err(
  type: internalErrMsg_TYPES,
  function_NAME: string
): Error_PROPS {
  return {
    error_TYPE: "internal",
    internal_MSG: myVocabs_REDUCER_ERRORS.internal[type],
    user_MSG: myVocabs_REDUCER_ERRORS.user.defaultInternal_MSG,
    function_NAME,
  };
}

///////////////////////////////////////////////////////////////////

export function Vocab_REDUCER(
  state: myVocabs_REDUCER_RESPONSE_TYPE,
  action: myVocabsReducerAction_PROPS
): myVocabs_REDUCER_RESPONSE_TYPE {
  switch (action.type) {
    case "SET_LOADING_STATE":
      return SET_reducerLoadingState(state, action.payload);
    case "ADD_VOCABS_TO_PAGINATION":
      return ADD_newPaginatedVocabsToReducerState(
        state,
        action.payload,
        CREATE_err
      );

    case "SET_ERROR":
      return SET_reducerError(state, action.payload);

    case "ADD_VOCAB":
      return ADD_vocabToReducer(state, action.payload, CREATE_err);

    case "DELETE_VOCAB":
      return DELETE_vocabFromReducer(state, action.payload, CREATE_err);

    case "RESET_STATE":
      return action.payload;
    default:
      return state;
  }
}
