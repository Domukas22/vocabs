//
//
//
import { useMemo } from "react";
import { _DisplaySettings_PROPS } from "@/src/utils/DisplaySettings";
import { z_vocabDisplaySettings_PROPS } from "@/src/zustand";

export default function USE_getActiveFilterCount(
  display_SETTINGS: z_vocabDisplaySettings_PROPS | undefined
) {
  const activeFilter_COUNT = useMemo(() => {
    const langFilterCount = display_SETTINGS?.langFilters?.length ?? 0; // Default to 0 if undefined
    const difficultyFilterCount =
      display_SETTINGS?.difficultyFilters?.length ?? 0; // Default to 0 if undefined

    return langFilterCount + difficultyFilterCount;
  }, [display_SETTINGS]);

  return activeFilter_COUNT;
}
