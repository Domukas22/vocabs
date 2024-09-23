//
//
//

import { useReducer } from "react";

// Define action types
const TOGGLE_MODAL = "TOGGLE_MODAL";

// Create the initial state for the modals
const initialState = {
  SHOW_selectLangModal: false,
  SHOW_selectListModal: false,
  SHOW_trTextModal: false,
  SHOW_trHighlightsModal: false,
  SHOW_deleteVocabModal: false,
};

// Create a mapping between action names and state keys
const modalActionMap = {
  selectedList: "SHOW_selectListModal",
  selectedLangs: "SHOW_selectLangModal",
  trText: "SHOW_trTextModal",
  trHighlights: "SHOW_trHighlightsModal",
  delete: "SHOW_deleteVocabModal",
} as const; // `as const` to make the keys readonly

// Define the reducer function
export type VocabModal_ACTIONS = keyof typeof modalActionMap; // Strongly typed action names

const modalReducer = (
  state: typeof initialState,
  action: { type: string; payload: VocabModal_ACTIONS }
) => {
  const stateKey = modalActionMap[action.payload];

  if (!stateKey) return state; // Prevent invalid keys

  switch (action.type) {
    case TOGGLE_MODAL:
      return {
        ...state,
        [stateKey]: !state[stateKey], // Toggle the value
      };
    default:
      return state;
  }
};

export default function USE_modalToggles() {
  const [state, dispatch] = useReducer(modalReducer, initialState);

  // Single toggle function that uses action names with full IntelliSense
  const TOGGLE_modal = (modalName: VocabModal_ACTIONS) => {
    dispatch({ type: TOGGLE_MODAL, payload: modalName });
  };

  return {
    modal_STATES: {
      ...state,
    },
    TOGGLE_modal, // Use this function to toggle any modal with IntelliSense
  };
}
