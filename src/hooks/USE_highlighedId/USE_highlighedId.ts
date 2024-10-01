//
//
//

import React, { useCallback, useEffect, useState } from "react";

let locked = false;

export default function USE_highlighedId(duration: number = 2000) {
  const [highlighted_ID, setHighlightedId] = useState<string | null>(null);
  const [locked, setLocked] = useState(false);

  const highlight = useCallback(
    (id: string) => {
      if (locked) return;

      setLocked(true);
      setHighlightedId(id);

      setTimeout(() => {
        setHighlightedId(null);
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
