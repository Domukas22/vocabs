//
//
//

import { DisplaySettingsView_TYPES } from "@/src/components/DisplaySettings_MODAL/type";
import React from "react";
import {
  PublicVocabsSorting_CONTENT,
  PublicVocabsFiltering_CONTENT,
  PublicVocabsCardPreview_CONTENT,
} from "./parts";

export function PublicVocabsDisplaySettings_CONTENT({
  current_TAB,
}: {
  current_TAB: DisplaySettingsView_TYPES;
}) {
  switch (current_TAB) {
    case "sort":
      return <PublicVocabsSorting_CONTENT />;
    case "filter":
      return <PublicVocabsFiltering_CONTENT />;
    case "vocab-preview":
      return <PublicVocabsCardPreview_CONTENT />;

    default:
      return null;
  }
}
