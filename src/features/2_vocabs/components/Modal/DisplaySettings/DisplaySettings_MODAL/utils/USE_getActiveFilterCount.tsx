//
//
//
import { useMemo } from "react";
import { _DisplaySettings_PROPS } from "@/src/utils/DisplaySettings";
import { DisplaySettings_PROPS } from "@/src/zustand";

export default function USE_getActiveFilterCount(
  display_SETTINGS: DisplaySettings_PROPS | undefined
) {
  const activeFilter_COUNT = useMemo(() => {
    const langFilterCount = display_SETTINGS?.langFilters?.length ?? 0; // Default to 0 if undefined
    const difficultyFilterCount =
      display_SETTINGS?.difficultyFilters?.length ?? 0; // Default to 0 if undefined

    return langFilterCount + difficultyFilterCount;
  }, [display_SETTINGS]);

  return activeFilter_COUNT;
}
