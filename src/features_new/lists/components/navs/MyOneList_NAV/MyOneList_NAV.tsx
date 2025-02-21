//
//
//

import FlashlistPage_NAV from "@/src/components/FlashlistPage_NAV/FlashlistPage_NAV";
import {
  NavBtn_WRAP,
  NavBack_BTN,
  NavSearch_BTN,
  NavDisplaySettings_BTN,
  NavCreate_BTN,
  NavOpenSearch_BTNS,
  NavListSettings_BTN,
} from "@/src/components/FlashlistPage_NAV/parts";
import { z_USE_myListsDisplaySettings } from "@/src/features_new/lists/hooks/zustand/displaySettings/z_USE_myListsDisplaySettings/z_USE_myListsDisplaySettings";
import { z_USE_myVocabsDisplaySettings } from "@/src/features_new/vocabs/hooks/zustand/displaySettings/z_USE_myVocabsDisplaySettings/z_USE_myVocabsDisplaySettings";
import { t } from "i18next";
import { useState, useRef } from "react";
import { TextInput } from "react-native";
import { USE_getListName } from "../../../hooks/USE_getListName/USE_getListName";

export function MyOneList_NAV({
  search = "",
  SET_search = () => {},
  OPEN_displaySettings = () => {},
  OPEN_listSettings = () => {},
  OPEN_createVocabModal = () => {},
  SHOW_listName = false,
}: {
  search: string;
  SHOW_listName: boolean;
  SET_search: (value: string) => void;
  OPEN_displaySettings: () => void;
  OPEN_listSettings: () => void;
  OPEN_createVocabModal: () => void;
}) {
  const [IS_searchOpen, SET_searchOpen] = useState(false);
  const search_REF = useRef<TextInput>(null);
  const { z_myVocabDisplay_SETTINGS } = z_USE_myVocabsDisplaySettings();
  const { langFilters, difficultyFilters } = z_myVocabDisplay_SETTINGS;
  const { list_NAME } = USE_getListName({ type: "private" });

  return (
    <FlashlistPage_NAV SHOW_listName={SHOW_listName} list_NAME={list_NAME}>
      <NavBtn_WRAP>
        {!IS_searchOpen ? (
          <>
            <NavBack_BTN />
            <NavListSettings_BTN OPEN_listSettings={OPEN_listSettings} />
            <NavSearch_BTN OPEN_search={() => SET_searchOpen(true)} />
            <NavDisplaySettings_BTN
              OPEN_displaySettings={OPEN_displaySettings}
              activeFilter_COUNT={
                (langFilters?.length || 0) + (difficultyFilters?.length + 0)
              }
            />
            <NavCreate_BTN OPEN_createModal={OPEN_createVocabModal} />
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
