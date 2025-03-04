//
//
//

import FlashlistPage_NAV from "@/src/components/FlashlistPage_NAV/FlashlistPage_NAV";
import {
  NavBtn_WRAP,
  NavBack_BTN,
  NavSearch_BTN,
  NavDisplaySettings_BTN,
  NavOpenSearch_BTNS,
} from "@/src/components/FlashlistPage_NAV/parts";
import { t } from "i18next";
import { useState, useRef } from "react";
import { TextInput } from "react-native";
import { z_USE_publicVocabsDisplaySettings } from "../../../hooks/zustand/displaySettings/z_USE_publicVocabsDisplaySettings/z_USE_publicVocabsDisplaySettings";

export function AllPublicVocabs_NAV({
  SHOW_listName = false,
  search = "",
  SET_search = () => {},
  OPEN_displaySettings = () => {},
}: {
  SHOW_listName: boolean;
  search: string;
  SET_search: (value: string) => void;
  OPEN_displaySettings: () => void;
}) {
  const [IS_searchOpen, SET_searchOpen] = useState(false);
  const search_REF = useRef<TextInput>(null);
  const { z_GET_activeFilterCount } = z_USE_publicVocabsDisplaySettings();

  return (
    <FlashlistPage_NAV
      SHOW_listName={SHOW_listName}
      list_NAME={t("listName.allPublicVocabs")}
    >
      <NavBtn_WRAP>
        {!IS_searchOpen ? (
          <>
            <NavBack_BTN />
            <NavSearch_BTN OPEN_search={() => SET_searchOpen(true)} />
            <NavDisplaySettings_BTN
              OPEN_displaySettings={OPEN_displaySettings}
              activeFilter_COUNT={z_GET_activeFilterCount() || 0}
            />
          </>
        ) : (
          <NavOpenSearch_BTNS
            search={search}
            search_REF={search_REF}
            CLOSE_search={() => SET_searchOpen(false)}
            SET_search={SET_search}
          />
        )}
      </NavBtn_WRAP>
    </FlashlistPage_NAV>
  );
}
