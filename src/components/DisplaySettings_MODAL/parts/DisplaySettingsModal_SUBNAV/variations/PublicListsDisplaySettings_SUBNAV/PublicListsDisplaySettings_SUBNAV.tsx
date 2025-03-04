//
//
//

import React from "react";
import {
  DisplaySettings_SUBNAV,
  DisplaySettingsSubnavFilterTab_BTN,
  DisplaySettingsSubnavSortTab_BTN,
} from "../../_parts";
import { DisplaySettingsView_TYPES } from "../../../../type";
import { z_USE_publicListsDisplaySettings } from "@/src/features_new/lists/hooks/zustand/displaySettings/z_USE_publicListsDisplaySettings/z_USE_publicListsDisplaySettings";

export function PublicListsDisplaySettings_SUBNAV({
  current_TAB,
  SET_currentTab,
}: {
  current_TAB: DisplaySettingsView_TYPES;
  SET_currentTab: React.Dispatch<
    React.SetStateAction<DisplaySettingsView_TYPES>
  >;
}) {
  const { z_GET_activeFilterCount } = z_USE_publicListsDisplaySettings();

  return (
    <DisplaySettings_SUBNAV>
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
