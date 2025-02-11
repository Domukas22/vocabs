//
//
//

import { useRef } from "react";

export function USE_abortController() {
  const abortControllerRef = useRef<AbortController | null>(null);

  const START_newRequest = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const newAbortController = new AbortController();
    abortControllerRef.current = newAbortController;
    return newAbortController;
  };

  return { START_newRequest };
}
