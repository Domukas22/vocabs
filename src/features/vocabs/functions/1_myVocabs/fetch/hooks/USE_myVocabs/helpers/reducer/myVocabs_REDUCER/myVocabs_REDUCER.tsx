//
//
//

import {
  myVocabsReducerAction_PROPS,
  myVocabsReducerState_PROPS,
} from "./types";

import {
  ADD_vocabToReducer,
  DELETE_vocabFromReducer,
  SET_reducerError,
  SET_reducerLoadingState,
  UPDATE_reducerState,
} from "./actions";

export const myVocabsReducerInitial_STATE: myVocabsReducerState_PROPS = {
  data: {
    vocabs: [],
    printed_IDS: new Set(),
    unpaginated_COUNT: 0,
    HAS_reachedEnd: false,
  },
  error: { value: false, msg: "" },
  loading_STATE: "loading",
};
/////////////////////////////////////////////////////////////

export function myVocabs_REDUCER(
  state: myVocabsReducerState_PROPS,
  action: myVocabsReducerAction_PROPS
): myVocabsReducerState_PROPS {
  switch (action.type) {
    case "SET_LOADING_STATE":
      return SET_reducerLoadingState(state, action.payload);

    case "UPDATE_STATE":
      return UPDATE_reducerState(state, action.payload);

    case "SET_ERROR":
      return SET_reducerError(state, action.payload);

    case "ADD_VOCAB":
      return ADD_vocabToReducer(state, action.payload);

    case "DELETE_VOCAB":
      return DELETE_vocabFromReducer(state, action.payload);

    case "RESET_STATE":
      return myVocabsReducerInitial_STATE;
    default:
      return state;
  }
}
