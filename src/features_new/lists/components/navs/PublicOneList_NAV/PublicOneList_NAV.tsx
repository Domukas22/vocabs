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
  NavSavePublicList_BTN,
} from "@/src/components/FlashlistPage_NAV/parts";
import { z_USE_myVocabsDisplaySettings } from "@/src/features_new/vocabs/hooks/zustand/displaySettings/z_USE_myVocabsDisplaySettings/z_USE_myVocabsDisplaySettings";
import { useState, useRef } from "react";
import { TextInput } from "react-native";
import { USE_getListName } from "../../../hooks/USE_getListName/USE_getListName";
import { z_USE_publicVocabsDisplaySettings } from "@/src/features_new/vocabs/hooks/zustand/displaySettings/z_USE_publicVocabsDisplaySettings/z_USE_publicVocabsDisplaySettings";

export function PublicOneList_NAV({
  SHOW_listName = false,
  search = "",
  SET_search = () => {},
  OPEN_saveListModal = () => {},
  OPEN_displaySettings = () => {},
}: {
  search: string;
  SHOW_listName: boolean;
  SET_search: (value: string) => void;
  OPEN_saveListModal: () => void;
  OPEN_displaySettings: () => void;
}) {
  const [IS_searchOpen, SET_searchOpen] = useState(false);
  const search_REF = useRef<TextInput>(null);
  const { z_GET_activeFilterCount, z_CLEAR_filters } =
    z_USE_publicVocabsDisplaySettings();

  const { list_NAME } = USE_getListName({ type: "public" });

  return (
    <FlashlistPage_NAV SHOW_listName={SHOW_listName} list_NAME={list_NAME}>
      <NavBtn_WRAP>
        {!IS_searchOpen ? (
          <>
            <NavBack_BTN extra_ACTION={() => z_CLEAR_filters()} />
            <NavSearch_BTN OPEN_search={() => SET_searchOpen(true)} />
            <NavDisplaySettings_BTN
              OPEN_displaySettings={OPEN_displaySettings}
              activeFilter_COUNT={z_GET_activeFilterCount() || 0}
            />
            <NavSavePublicList_BTN OPEN_saveListModal={OPEN_saveListModal} />
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
