//
//
//

import { useReducer } from "react";

// Define action types
const TOGGLE_MODAL = "TOGGLE_MODAL";

// Define the shape of the initial state definition
interface ModalDefinition {
  name: string; // Modal name
  initialValue: boolean; // Initial visibility state
}

// Define the reducer function
const modalReducer = (
  state: Record<string, boolean>,
  action: {
    type: string;
    payload: { modalName: string; value: boolean | null };
  }
) => {
  const { modalName, value } = action.payload;

  // Check if the modalName exists in the state
  if (!(modalName in state)) return state;

  switch (action.type) {
    case TOGGLE_MODAL:
      return {
        ...state,
        [modalName]: value !== null ? value : !state[modalName], // Toggle or explicitly set the value
      };
    default:
      return state;
  }
};

// Main hook to manage modal toggles
export default function USE_modalToggles(modalDefinitions: ModalDefinition[]) {
  // Generate the initial state from the provided modal definitions
  const initialState = modalDefinitions.reduce(
    (acc, { name, initialValue }) => {
      acc[name] = initialValue; // Set the initial value for each modal
      return acc;
    },
    {} as Record<string, boolean>
  );

  const [state, dispatch] = useReducer(modalReducer, initialState);

  // Single toggle function that uses action names with full IntelliSense
  const TOGGLE_modal = (modalName: string, value: boolean | null = null) => {
    dispatch({ type: TOGGLE_MODAL, payload: { modalName, value } });
    console.log(
      `${modalName} toggled to ${value !== null ? value : !state[modalName]}`
    );
  };

  return {
    modal_STATES: {
      ...state,
    },
    TOGGLE_modal, // Use this function to toggle any modal with IntelliSense
  };
}
