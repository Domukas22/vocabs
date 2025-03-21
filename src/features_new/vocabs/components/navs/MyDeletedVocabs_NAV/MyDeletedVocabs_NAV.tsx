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
import { z_USE_myVocabsDisplaySettings } from "../../../hooks/zustand/displaySettings/z_USE_myVocabsDisplaySettings/z_USE_myVocabsDisplaySettings";

export function MyDeletedVocabs_NAV({
  search = "",
  SET_search = () => {},
  OPEN_displaySettings = () => {},

  SHOW_listName = false,
}: {
  search: string;
  SHOW_listName: boolean;
  SET_search: (value: string) => void;
  OPEN_displaySettings: () => void;
}) {
  const [IS_searchOpen, SET_searchOpen] = useState(false);
  const search_REF = useRef<TextInput>(null);
  const { filters } = z_USE_myVocabsDisplaySettings();
  const { langs = [] } = filters;

  return (
    <FlashlistPage_NAV
      SHOW_listName={SHOW_listName}
      list_NAME={t("listName.deletedVocabs")}
    >
      <NavBtn_WRAP>
        {!IS_searchOpen ? (
          <>
            <NavBack_BTN />
            <NavSearch_BTN OPEN_search={() => SET_searchOpen(true)} />
            <NavDisplaySettings_BTN
              OPEN_displaySettings={OPEN_displaySettings}
              activeFilter_COUNT={langs?.length}
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
