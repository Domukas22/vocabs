//
//
//

import { DisplaySettingsView_TYPES } from "@/src/components/DisplaySettings_MODAL/type";
import React from "react";
import {
  PublicListsSorting_CONTENT,
  PublicListsFiltering_CONTENT,
} from "./parts";

export function PublicListsDisplaySettings_CONTENT({
  current_TAB,
}: {
  current_TAB: DisplaySettingsView_TYPES;
}) {
  switch (current_TAB) {
    case "sort":
      return <PublicListsSorting_CONTENT />;
    case "filter":
      return <PublicListsFiltering_CONTENT />;
    default:
      return null;
  }
}
