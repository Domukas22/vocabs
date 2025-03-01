//
//
//

import { Styled_TEXT } from "@/src/components/1_grouped/texts/Styled_TEXT/Styled_TEXT";
import { DisplaySettingsView_TYPES } from "@/src/components/DisplaySettings_MODAL/type";
import { LanguagesBtn_BLOCK } from "@/src/components/LanguagesBtn_BLOCK/LanguagesBtn_BLOCK";
import { z_USE_myLists } from "@/src/features_new/lists/hooks/zustand/z_USE_myLists/z_USE_myLists";
import { z_USE_myOneList } from "@/src/features_new/lists/hooks/zustand/z_USE_myOneList/z_USE_myOneList";
import { The4Fetch_TYPES } from "@/src/types/general_TYPES";
import { t } from "i18next";
import React from "react";
import { MyListsFiltering_CONTENT, MyListsSorting_CONTENT } from "./parts";

export function MyListsDisplaySettings_CONTENT({
  current_TAB,
}: {
  current_TAB: DisplaySettingsView_TYPES;
}) {
  const {} = z_USE_myLists();
  // 🔴🔴 TODO ==> collect all lang ids inside the "z_USE_myLists" hook

  switch (current_TAB) {
    case "sort":
      return <MyListsSorting_CONTENT />;
    case "filter":
      return <MyListsFiltering_CONTENT />;
    default:
      return null;
  }
}
