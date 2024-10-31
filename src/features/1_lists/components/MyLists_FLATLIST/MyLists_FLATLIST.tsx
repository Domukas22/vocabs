//
//
//

import Btn from "@/src/components/Btn/Btn";
import { ICON_X } from "@/src/components/icons/icons";
import { MyList_BTN } from "@/src/features/1_lists/components/MyList_BTN/MyList_BTN";
import Styled_FLATLIST from "@/src/components/Styled_FLATLIST/Styled_FLATLIST/Styled_FLATLIST";

import { useTranslation } from "react-i18next";
import SwipeableExample from "@/src/components/SwipeableExample/SwipeableExample";

import React from "react";
import { FlatList } from "react-native";
import { List_MODEL } from "@/src/db/watermelon_MODELS";

import { HEADER_MARGIN } from "@/src/constants/globalVars";
import { Styled_TEXT } from "@/src/components/Styled_TEXT/Styled_TEXT";

interface MyListsFlatlist_PROPS {
  _ref: React.RefObject<FlatList>;
  lists: List_MODEL[] | undefined;
  SHOW_bottomBtn: boolean;
  highlighted_ID?: string | undefined;
  listHeader_EL: React.ReactNode;
  listFooter_EL: React.ReactNode;
  SELECT_list: (id: string) => void;
  PREPARE_listRename: (list: List_MODEL) => void;
  PREPADE_deleteList: (list: List_MODEL) => void;
  TOGGLE_createListModal: () => void;
  onScroll: () => {};
}

export default function MyLists_FLATLIST({
  _ref,
  lists,
  SHOW_bottomBtn,
  highlighted_ID,
  SELECT_list,
  PREPARE_listRename,
  PREPADE_deleteList,
  TOGGLE_createListModal,
  onScroll,
  listHeader_EL,
  listFooter_EL,
}: MyListsFlatlist_PROPS) {
  const { t } = useTranslation();

  return (
    <Styled_FLATLIST
      _ref={_ref}
      data={lists || []}
      onScroll={onScroll}
      keyExtractor={(item) => item?.id}
      ListHeaderComponent={listHeader_EL}
      ListFooterComponent={listFooter_EL}
      renderItem={({ item }: { item: List_MODEL }) => (
        <SwipeableExample
          leftBtn_ACTION={() => {
            PREPARE_listRename(item);
          }}
          rightBtn_ACTION={() => PREPADE_deleteList(item)}
        >
          {item instanceof List_MODEL && (
            <MyList_BTN
              list={item}
              onPress={() => {
                if (typeof item?.id === "string") {
                  SELECT_list(item.id);
                }
              }}
              highlighted={highlighted_ID === item?.id}
            />
          )}
        </SwipeableExample>
      )}
    />
  );
}
