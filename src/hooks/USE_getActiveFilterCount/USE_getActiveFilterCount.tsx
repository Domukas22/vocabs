//
//
//

import { useMemo } from "react";
import { _DisplaySettings_PROPS } from "@/src/utils/DisplaySettings/DisplaySettings";
import { USE_zustand } from "@/src/hooks/USE_zustand/USE_zustand";

export function USE_getActiveFilterCount(target: "lists" | "vocabs" = "lists") {
  const { z_listDisplay_SETTINGS, z_vocabDisplay_SETTINGS } = USE_zustand();

  const activeFilter_COUNT = useMemo(() => {
    if (target === "lists") {
      return z_listDisplay_SETTINGS.langFilters?.length ?? 0;
    } else if (target === "vocabs") {
      return (
        z_vocabDisplay_SETTINGS.langFilters?.length ??
        0 + z_vocabDisplay_SETTINGS.difficultyFilters.length ??
        0
      );
    } else return 0;
  }, [target, z_listDisplay_SETTINGS, z_vocabDisplay_SETTINGS]);

  return { activeFilter_COUNT };
}
