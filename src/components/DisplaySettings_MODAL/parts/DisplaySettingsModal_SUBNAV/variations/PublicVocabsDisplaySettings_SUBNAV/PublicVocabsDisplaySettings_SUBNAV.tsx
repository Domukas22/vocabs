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
  const { z_publicVocabDisplay_SETTINGS } = z_USE_publicVocabsDisplaySettings();
  const activeFilter_COUNT =
    z_publicVocabDisplay_SETTINGS?.langFilters?.length || 0;

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
