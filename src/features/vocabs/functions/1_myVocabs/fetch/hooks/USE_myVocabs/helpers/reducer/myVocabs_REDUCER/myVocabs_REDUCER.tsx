//
//
//

import Vocab_MODEL from "@/src/db/models/Vocab_MODEL";
import { loadingState_TYPES } from "@/src/types";

export type myVocabsReducerState_PROPS = {
  data: {
    vocabs: Vocab_MODEL[];
    printed_IDS: Set<string>;
    unpaginated_COUNT: number;
  };
  error: { value: boolean; msg: string };
  loading_STATE: loadingState_TYPES;
};

export type myVocabsReducer_ACTION =
  | { type: "ADD_VOCAB"; payload: Vocab_MODEL }
  | {
      type: "UPDATE_STATE";
      payload: { vocabs: Vocab_MODEL[]; unpaginated_COUNT: number };
    }
  | { type: "DELETE_VOCAB"; payload: string }
  | { type: "SET_LOADING_STATE"; payload: loadingState_TYPES }
  | { type: "SET_ERROR"; payload: { value: boolean; msg: string } }
  | { type: "RESET_STATE" };

export const myVocabsReducerInitial_STATE: myVocabsReducerState_PROPS = {
  data: {
    vocabs: [],
    printed_IDS: new Set(),
    unpaginated_COUNT: 0,
  },
  error: { value: false, msg: "" },
  loading_STATE: "loading",
};
/////////////////////////////////////////////////////////////

export function myVocabs_REDUCER(
  state: myVocabsReducerState_PROPS,
  action: myVocabsReducer_ACTION
): myVocabsReducerState_PROPS {
  switch (action.type) {
    case "SET_LOADING_STATE":
      return SET_reducersLoadingState(state, action.payload);

    case "SET_ERROR":
      return SET_reducersError(state, action.payload);

    case "UPDATE_STATE":
      return UPDATE_reducerState(state, action.payload);

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

const UPDATE_reducerState = (
  state: myVocabsReducerState_PROPS,
  payload: { vocabs: Vocab_MODEL[]; unpaginated_COUNT: number }
) => {
  const updatedVocabs = [...state.data.vocabs, ...payload.vocabs];
  const updatedPrintedIds = new Set(state.data.printed_IDS);
  payload.vocabs.forEach((vocab) => updatedPrintedIds.add(vocab.id));

  return {
    ...state,
    data: {
      vocabs: updatedVocabs,
      printed_IDS: updatedPrintedIds,
      unpaginated_COUNT: payload?.unpaginated_COUNT,
    },
  };
};
const DELETE_vocabFromReducer = (
  state: myVocabsReducerState_PROPS,
  payload: string
) => {
  const updatedVocabs = state.data.vocabs.filter(
    (vocab) => vocab.id !== payload
  );
  const updatedPrintedIds = new Set(state.data.printed_IDS);
  updatedPrintedIds.delete(payload);

  return {
    ...state,
    data: {
      vocabs: updatedVocabs,
      printed_IDS: updatedPrintedIds,
      unpaginated_COUNT: state.data.unpaginated_COUNT - 1,
    },
  };
};
const ADD_vocabToReducer = (
  state: myVocabsReducerState_PROPS,
  payload: Vocab_MODEL
) => {
  const newVocabs = [payload, ...state.data.vocabs];
  const updatedIds = new Set(state.data.printed_IDS);
  updatedIds.add(payload.id);

  return {
    ...state,
    data: {
      vocabs: newVocabs,
      printed_IDS: updatedIds,
      unpaginated_COUNT: state.data.unpaginated_COUNT + 1,
    },
  };
};
const SET_reducersError = (
  state: myVocabsReducerState_PROPS,
  payload: { value: boolean; msg: string }
) => {
  return { ...state, error: payload };
};
const SET_reducersLoadingState = (
  state: myVocabsReducerState_PROPS,
  payload: loadingState_TYPES
) => {
  return { ...state, loading_STATE: payload };
};
