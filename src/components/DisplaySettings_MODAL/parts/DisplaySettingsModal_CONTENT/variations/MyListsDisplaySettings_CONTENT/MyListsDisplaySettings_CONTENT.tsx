//
//
//

import { DisplaySettingsView_TYPES } from "@/src/components/DisplaySettings_MODAL/type";
import React from "react";
import { MyListsFiltering_CONTENT, MyListsSorting_CONTENT } from "./parts";

export function MyListsDisplaySettings_CONTENT({
  current_TAB,
}: {
  current_TAB: DisplaySettingsView_TYPES;
}) {
  switch (current_TAB) {
    case "sort":
      return <MyListsSorting_CONTENT />;
    case "filter":
      return <MyListsFiltering_CONTENT />;
    default:
      return null;
  }
}
