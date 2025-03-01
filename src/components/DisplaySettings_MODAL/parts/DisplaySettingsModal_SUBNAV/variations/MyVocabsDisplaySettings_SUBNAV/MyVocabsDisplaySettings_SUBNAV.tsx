//
//
//

import React from "react";
import {
  DisplaySettings_SUBNAV,
  DisplaySettingsSubnavFilterTab_BTN,
  DisplaySettingsSubnavSortTab_BTN,
  DisplaySettingsSubnavVocabPreviewTab_BTN,
} from "../../_parts";
import { z_USE_myVocabsDisplaySettings } from "@/src/features_new/vocabs/hooks/zustand/displaySettings/z_USE_myVocabsDisplaySettings/z_USE_myVocabsDisplaySettings";
import { DisplaySettingsView_TYPES } from "../../../../type";

export function MyVocabsDisplaySettings_SUBNAV({
  current_TAB,
  SET_currentTab,
}: {
  current_TAB: DisplaySettingsView_TYPES;
  SET_currentTab: React.Dispatch<
    React.SetStateAction<DisplaySettingsView_TYPES>
  >;
}) {
  const { z_myVocabDisplay_SETTINGS } = z_USE_myVocabsDisplaySettings();
  const activeFilter_COUNT =
    (z_myVocabDisplay_SETTINGS?.langFilters?.length || 0) +
    (z_myVocabDisplay_SETTINGS?.difficultyFilters?.length || 0);

  return (
    <DisplaySettings_SUBNAV>
      <DisplaySettingsSubnavVocabPreviewTab_BTN
        current_TAB={current_TAB}
        SELECT_tab={() => SET_currentTab("filter")}
      />
      <DisplaySettingsSubnavFilterTab_BTN
        current_TAB={current_TAB}
        SELECT_tab={() => SET_currentTab("filter")}
        activeFilter_COUNT={activeFilter_COUNT}
      />
      <DisplaySettingsSubnavSortTab_BTN
        current_TAB={current_TAB}
        SELECT_tab={() => SET_currentTab("sort")}
      />
    </DisplaySettings_SUBNAV>
  );
}
