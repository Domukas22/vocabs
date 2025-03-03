//
//
//

import { DisplaySettingsView_TYPES } from "@/src/components/DisplaySettings_MODAL/type";
import React from "react";
import {
  MyVocabsSorting_CONTENT,
  MyVocabsFiltering_CONTENT,
  MyVocabsCardPreview_CONTENT,
} from "./parts";
import { Styled_TEXT } from "@/src/components/1_grouped/texts/Styled_TEXT/Styled_TEXT";

export function MyVocabsDisplaySettings_CONTENT({
  current_TAB,
}: {
  current_TAB: DisplaySettingsView_TYPES;
}) {
  switch (current_TAB) {
    case "sort":
      return <MyVocabsSorting_CONTENT />;
    case "filter":
      return <MyVocabsFiltering_CONTENT />;
    case "vocab-preview":
      return <MyVocabsCardPreview_CONTENT />;

    default:
      return null;
  }
}
