//
//
//

import Btn from "@/src/components/1_grouped/buttons/Btn/Btn";
import { DisplaySettingsView_TYPES } from "../../../../type";

export function DisplaySettingsSubnavFilterTab_BTN({
  current_TAB = "filter",
  SELECT_tab = () => {},
  activeFilter_COUNT = 0,
}: {
  current_TAB: DisplaySettingsView_TYPES;
  SELECT_tab: () => void;
  activeFilter_COUNT: number;
}) {
  return (
    <Btn
      text="Filtern"
      type={current_TAB === "filter" ? "difficulty_1_active" : "simple"}
      onPress={SELECT_tab}
      style={{ marginRight: 8 }}
      topRightIconCount={activeFilter_COUNT}
    />
  );
}
