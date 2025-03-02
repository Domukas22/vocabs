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
} from "@/src/components/FlashlistPage_NAV/parts";
import { z_USE_myListsDisplaySettings } from "@/src/features_new/lists/hooks/zustand/displaySettings/z_USE_myListsDisplaySettings/z_USE_myListsDisplaySettings";
import { t } from "i18next";
import { useState, useRef } from "react";
import { TextInput } from "react-native";

export function MyLists_NAV({
  search = "",
  SET_search = () => {},
  OPEN_displaySettings = () => {},
  OPEN_createListModal = () => {},
  SHOW_listName = false,
}: {
  search: string;
  SHOW_listName: boolean;
  SET_search: (value: string) => void;
  OPEN_displaySettings: () => void;
  OPEN_createListModal: () => void;
}) {
  const [IS_searchOpen, SET_searchOpen] = useState(false);
  const search_REF = useRef<TextInput>(null);
  const { filters } = z_USE_myListsDisplaySettings();
  const { langs = [] } = filters;

  return (
    <FlashlistPage_NAV
      SHOW_listName={SHOW_listName}
      list_NAME={t("header.myLists")}
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
            <NavCreate_BTN OPEN_createModal={OPEN_createListModal} />
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
