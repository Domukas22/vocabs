//
//
//

import { useMemo } from "react";

export function USE_hasReachedEnd(
  current_LENGTH: number,
  total: number
): {
  HAS_reachedEnd: boolean;
} {
  const HAS_reachedEnd = useMemo(
    () => current_LENGTH >= total,
    [current_LENGTH, total]
  );

  return { HAS_reachedEnd };
}
