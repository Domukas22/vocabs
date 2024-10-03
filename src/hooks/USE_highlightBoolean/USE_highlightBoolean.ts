//
//
//

import { useState, useCallback } from "react";

// Custom hook to handle highlighting a boolean state
export function USE_highlightBoolean(duration: number = 5000) {
  const [isHighlighted, SET_isHighlighted] = useState(false);

  const highlight = useCallback(() => {
    if (!isHighlighted) {
      SET_isHighlighted(true); // Set highlighted state to true

      // Clear highlight after the specified duration
      setTimeout(() => {
        SET_isHighlighted(false); // Reset the highlighted state
      }, duration);
    }
  }, [isHighlighted, duration]); // Dependencies

  return {
    isHighlighted, // The current highlight state
    highlight, // Function to trigger highlighting
  };
}
