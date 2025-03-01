//
//
//

import Btn from "@/src/components/1_grouped/buttons/Btn/Btn";
import { DisplaySettingsView_TYPES } from "../../../../type";

export function DisplaySettingsSubnavVocabPreviewTab_BTN({
  current_TAB = "filter",
  SELECT_tab = () => {},
}: {
  current_TAB: DisplaySettingsView_TYPES;
  SELECT_tab: () => void;
}) {
  return (
    <Btn
      type={current_TAB === "vocab-preview" ? "difficulty_1_active" : "simple"}
      text="Preview"
      onPress={SELECT_tab}
      style={{ marginRight: 8 }}
    />
  );
}
