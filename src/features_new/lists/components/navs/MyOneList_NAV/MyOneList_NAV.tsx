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
import { TextInput, View } from "react-native";
import { USE_getListName } from "../../../hooks/USE_getListName/USE_getListName";
import Btn from "@/src/components/1_grouped/buttons/Btn/Btn";
import { MyColors } from "@/src/constants/MyColors";
import {
  ICON_arrow,
  ICON_checkMark,
  ICON_delete,
  ICON_download,
  ICON_dropdownArrow,
  ICON_X,
} from "@/src/components/1_grouped/icons/icons";
import { Styled_TEXT } from "@/src/components/1_grouped/texts/Styled_TEXT/Styled_TEXT";

export function MyOneList_NAV({
  search = "",
  SET_search = () => {},
  OPEN_displaySettings = () => {},
  OPEN_listSettings = () => {},
  OPEN_createVocabModal = () => {},

  CANCEL_selection = () => {},

  SHOW_listName = false,
  IS_vocabSelectionOn = false,
  selectedVocab_COUNT = 0,
}: {
  search: string;
  SHOW_listName: boolean;
  SET_search: (value: string) => void;
  OPEN_displaySettings: () => void;
  OPEN_listSettings: () => void;
  OPEN_createVocabModal: () => void;

  CANCEL_selection: () => void;
  IS_vocabSelectionOn: boolean;
  selectedVocab_COUNT: number;
}) {
  const [IS_searchOpen, SET_searchOpen] = useState(false);
  const search_REF = useRef<TextInput>(null);
  const { z_GET_activeFilterCount, z_CLEAR_filters } =
    z_USE_myVocabsDisplaySettings();

  const { list_NAME } = USE_getListName({ type: "private" });

  return (
    <FlashlistPage_NAV
      SHOW_listName={IS_vocabSelectionOn || SHOW_listName}
      list_NAME={list_NAME}
      IS_vocabSelectionOn={IS_vocabSelectionOn}
      selectedVocab_COUNT={selectedVocab_COUNT}
    >
      <NavBtn_WRAP>
        {!IS_vocabSelectionOn && (
          <>
            {!IS_searchOpen ? (
              <>
                <NavBack_BTN extra_ACTION={() => z_CLEAR_filters()} />
                <NavListSettings_BTN OPEN_listSettings={OPEN_listSettings} />
                <NavSearch_BTN OPEN_search={() => SET_searchOpen(true)} />
                <NavDisplaySettings_BTN
                  OPEN_displaySettings={OPEN_displaySettings}
                  activeFilter_COUNT={z_GET_activeFilterCount() || 0}
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
          </>
        )}

        {IS_vocabSelectionOn && (
          <View style={{ flexDirection: "row", gap: 8, flex: 1 }}>
            {selectedVocab_COUNT ? (
              <View style={{ flex: 1, flexDirection: "row", gap: 8 }}>
                <Btn
                  text={t("btn.performAnAction")}
                  text_STYLES={{ flex: 1 }}
                  iconRight={<ICON_dropdownArrow />}
                  style={{ flex: 1 }}
                />
                {/* <Btn
                  iconRight={
                    <Styled_TEXT type="text_18_bold">
                      {selectedVocab_COUNT}
                    </Styled_TEXT>
                  }
                  style={{ paddingHorizontal: 20 }}
                  onPress={CANCEL_selection}
                /> */}
              </View>
            ) : (
              <View
                style={{
                  height: "auto",
                  flex: 1,
                  justifyContent: "center",
                }}
              >
                <Styled_TEXT style={{ color: MyColors.text_white_06 }}>
                  {t("label.tapOnAVocab")}
                </Styled_TEXT>
              </View>
            )}

            <Btn
              iconRight={<ICON_X big rotate color="red" />}
              onPress={CANCEL_selection}
            />
          </View>
        )}
      </NavBtn_WRAP>
    </FlashlistPage_NAV>
  );
}
