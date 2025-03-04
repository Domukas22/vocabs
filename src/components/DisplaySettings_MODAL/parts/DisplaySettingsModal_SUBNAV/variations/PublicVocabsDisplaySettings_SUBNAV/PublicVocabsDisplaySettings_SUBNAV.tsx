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
import { DisplaySettingsView_TYPES } from "../../../../type";
import { z_USE_publicVocabsDisplaySettings } from "@/src/features_new/vocabs/hooks/zustand/displaySettings/z_USE_publicVocabsDisplaySettings/z_USE_publicVocabsDisplaySettings";

export function PublicVocabsDisplaySettings_SUBNAV({
  current_TAB,
  SET_currentTab,
}: {
  current_TAB: DisplaySettingsView_TYPES;
  SET_currentTab: React.Dispatch<
    React.SetStateAction<DisplaySettingsView_TYPES>
  >;
}) {
  const { z_GET_activeFilterCount } = z_USE_publicVocabsDisplaySettings();

  return (
    <DisplaySettings_SUBNAV>
      <DisplaySettingsSubnavVocabPreviewTab_BTN
        current_TAB={current_TAB}
        SELECT_tab={() => SET_currentTab("filter")}
      />
      <DisplaySettingsSubnavFilterTab_BTN
        current_TAB={current_TAB}
        SELECT_tab={() => SET_currentTab("filter")}
        activeFilter_COUNT={z_GET_activeFilterCount() || 0}
      />
      <DisplaySettingsSubnavSortTab_BTN
        current_TAB={current_TAB}
        SELECT_tab={() => SET_currentTab("sort")}
      />
    </DisplaySettings_SUBNAV>
  );
}
