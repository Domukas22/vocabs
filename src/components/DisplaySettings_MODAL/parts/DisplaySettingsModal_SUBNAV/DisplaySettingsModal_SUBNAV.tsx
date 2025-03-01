//
//
//

import { The4Fetch_TYPES } from "@/src/types/general_TYPES";
import { DisplaySettingsView_TYPES } from "../../type";
import {
  MyListsDisplaySettings_SUBNAV,
  MyVocabsDisplaySettings_SUBNAV,
  PublicListsDisplaySettings_SUBNAV,
  PublicVocabsDisplaySettings_SUBNAV,
} from "./variations";

export function DisplaySettingsModal_SUBNAV({
  type,
  current_TAB,
  SET_currentTab,
}: {
  type: The4Fetch_TYPES;
  current_TAB: DisplaySettingsView_TYPES;
  SET_currentTab: React.Dispatch<
    React.SetStateAction<DisplaySettingsView_TYPES>
  >;
}) {
  switch (type) {
    case undefined:
      return null;
    case "my-lists":
      return MyListsDisplaySettings_SUBNAV({ current_TAB, SET_currentTab });
    case "my-vocabs":
      return MyVocabsDisplaySettings_SUBNAV({ current_TAB, SET_currentTab });
    case "public-lists":
      return PublicListsDisplaySettings_SUBNAV({
        current_TAB,
        SET_currentTab,
      });
    case "public-vocabs":
      return PublicVocabsDisplaySettings_SUBNAV({
        current_TAB,
        SET_currentTab,
      });
  }
}
