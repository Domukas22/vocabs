//
//
//

import {
  myVocabs_REDUCER_RESPONSE_TYPE,
  myVocabsReducerAction_PROPS,
} from "./types";

import {
  ADD_vocabToReducer,
  DELETE_vocabFromReducer,
  SET_reducerError,
  SET_reducerLoadingState,
  ADD_newPaginatedVocabsToReducerState,
} from "./helpers";

///////////////////////////////////////////////////////////////////

export function Vocab_REDUCER(
  state: myVocabs_REDUCER_RESPONSE_TYPE,
  action: myVocabsReducerAction_PROPS
): myVocabs_REDUCER_RESPONSE_TYPE {
  switch (action.type) {
    case "SET_LOADING_STATE":
      return SET_reducerLoadingState(state, action.payload);
    case "ADD_VOCABS_TO_PAGINATION":
      return ADD_newPaginatedVocabsToReducerState(state, action.payload);

    case "SET_ERROR":
      return SET_reducerError(state, action.payload);

    case "ADD_VOCAB":
      return ADD_vocabToReducer(state, action.payload);

    case "DELETE_VOCAB":
      return DELETE_vocabFromReducer(state, action.payload);

    case "RESET_STATE":
      return action.payload;
    default:
      return state;
  }
}
