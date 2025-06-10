//
//
//

import FlashlistPage_NAV from "@/src/components/FlashlistPage_NAV/FlashlistPage_NAV";
import {
  NavBtn_WRAP,
  NavBack_BTN,
  NavDisplaySettings_BTN,
  NavReload_BTN,
} from "@/src/components/FlashlistPage_NAV/parts";

export function Flashcards_NAV({
  OPEN_displaySettings = () => {},
  IS_reloadDisabled = false,
}: {
  OPEN_displaySettings: () => void;
  IS_reloadDisabled: boolean;
}) {
  return (
    <FlashlistPage_NAV
      SHOW_listName={true}
      list_NAME={"Karteikarten Modus"}
      IS_vocabSelectionOn={false}
      selectedVocab_COUNT={0}
    >
      <NavBtn_WRAP>
        <NavBack_BTN extra_ACTION={() => {}} />
        <NavDisplaySettings_BTN
          OPEN_displaySettings={OPEN_displaySettings}
          activeFilter_COUNT={0}
        />
        <NavReload_BTN IS_disabled={IS_reloadDisabled} />
      </NavBtn_WRAP>
    </FlashlistPage_NAV>
  );
}
