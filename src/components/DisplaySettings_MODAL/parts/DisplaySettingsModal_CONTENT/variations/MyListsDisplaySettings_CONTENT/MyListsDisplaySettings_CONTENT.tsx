//
//
//

import { DisplaySettingsView_TYPES } from "@/src/components/DisplaySettings_MODAL/type";
import React from "react";
import { MyListsFiltering_CONTENT, MyListsSorting_CONTENT } from "./parts";

export function MyListsDisplaySettings_CONTENT({
  current_TAB,
  lang_IDS = [],
}: {
  current_TAB: DisplaySettingsView_TYPES;
  lang_IDS: string[];
}) {
  switch (current_TAB) {
    case "sort":
      return <MyListsSorting_CONTENT />;
    case "filter":
      return <MyListsFiltering_CONTENT lang_IDS={lang_IDS} />;
    default:
      return null;
  }
}
