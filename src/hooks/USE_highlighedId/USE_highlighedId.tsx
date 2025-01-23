//
//
//

import { useCallback, useState } from "react";

export function USE_highlighedId(duration: number = 5000) {
  const [highlighted_ID, setHighlightedId] = useState<string | undefined>(
    undefined
  );
  const [locked, setLocked] = useState(false);

  const highlight = useCallback(
    (id: string | undefined) => {
      if (locked) return;

      setLocked(true);
      setHighlightedId(id);

      setTimeout(() => {
        setHighlightedId(undefined);
        setLocked(false);
      }, duration);
    },
    [locked, duration]
  );

  return {
    highlighted_ID,
    highlight,
  };
}
