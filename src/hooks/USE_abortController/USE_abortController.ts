//
//
//

import { useRef } from "react";

export function USE_abortController() {
  const abortControllerRef = useRef<AbortController | null>(null);

  const startNewRequest = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const newAbortController = new AbortController();
    abortControllerRef.current = newAbortController;
    return newAbortController;
  };

  return { startNewRequest, abortControllerRef };
}
