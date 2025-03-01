//
//
//

import { The4Fetch_TYPES } from "@/src/types/general_TYPES";
import { DisplaySettingsView_TYPES } from "../../type";
import { MyListsDisplaySettings_CONTENT } from "./variations";

export function DisplaySettingsModal_CONTENT({
  current_TAB,
  type,
}: {
  current_TAB: DisplaySettingsView_TYPES;
  type: The4Fetch_TYPES;
}) {
  switch (type) {
    case "my-lists":
      return <MyListsDisplaySettings_CONTENT current_TAB={current_TAB} />;
    default:
      return null;
  }
}
