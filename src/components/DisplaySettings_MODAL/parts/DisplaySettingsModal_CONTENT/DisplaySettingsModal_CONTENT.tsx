//
//
//

import { The4Fetch_TYPES } from "@/src/types/general_TYPES";
import { DisplaySettingsView_TYPES } from "../../type";
import {
  MyListsDisplaySettings_CONTENT,
  MyVocabsDisplaySettings_CONTENT,
  PublicListsDisplaySettings_CONTENT,
  PublicVocabsDisplaySettings_CONTENT,
} from "./variations";

export function DisplaySettingsModal_CONTENT({
  current_TAB,
  type,
  lang_IDS = [],
}: {
  current_TAB: DisplaySettingsView_TYPES;
  type: The4Fetch_TYPES;
  lang_IDS: string[];
}) {
  switch (type) {
    case "my-lists":
      return (
        <MyListsDisplaySettings_CONTENT
          current_TAB={current_TAB}
          lang_IDS={lang_IDS}
        />
      );
    case "public-lists":
      return (
        <PublicListsDisplaySettings_CONTENT
          current_TAB={current_TAB}
          lang_IDS={lang_IDS}
        />
      );
    case "my-vocabs":
      return (
        <MyVocabsDisplaySettings_CONTENT
          current_TAB={current_TAB}
          lang_IDS={lang_IDS}
        />
      );
    case "public-vocabs":
      return (
        <PublicVocabsDisplaySettings_CONTENT
          current_TAB={current_TAB}
          lang_IDS={lang_IDS}
        />
      );
    default:
      return null;
  }
}
