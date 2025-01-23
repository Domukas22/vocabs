//
//
//
import { useState, useCallback } from "react";

// Define the hook for managing modals
export function USE_modalToggles<T extends string>(modalNames: T[]) {
  // Create an object to hold the modal states and their associated functions
  const modals = modalNames.reduce((acc, modalName) => {
    const [IS_open, setIS_open] = useState(false);

    // Define the toggle function
    const toggle = useCallback(() => {
      setIS_open((prev) => !prev);
    }, []);

    // Store the state and functions for each modal
    acc[modalName] = {
      IS_open,
      set: setIS_open,
      toggle,
    };

    return acc;
  }, {} as Record<T, { IS_open: boolean; set: (val: boolean) => void; toggle: () => void }>);

  return { modals };
}
