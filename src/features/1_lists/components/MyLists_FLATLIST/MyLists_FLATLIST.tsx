//
//
//

import Btn from "@/src/components/Btn/Btn";
import { ICON_X } from "@/src/components/icons/icons";
import MyList_BTN from "@/src/features/1_lists/components/MyList_BTN/MyList_BTN";
import Styled_FLATLIST from "@/src/components/Styled_FLATLIST/Styled_FLATLIST/Styled_FLATLIST";
import { List_PROPS } from "@/src/db/props";
import { useTranslation } from "react-i18next";
import SwipeableExample from "@/src/components/SwipeableExample/SwipeableExample";
import Label from "@/src/components/Label/Label";
import React from "react";
import { FlatList } from "react-native";

interface MyListsFlatlist_PROPS {
  _ref: React.RefObject<FlatList>;
  lists: List_PROPS[];
  SHOW_bottomBtn: boolean;
  highlighted_ID?: string | undefined;
  SELECT_list: (list: List_PROPS) => void;
  PREPARE_listRename: (list: List_PROPS) => void;
  PREPADE_deleteList: (list: List_PROPS) => void;
  TOGGLE_createListModal: () => void;
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
}: MyListsFlatlist_PROPS) {
  const { t } = useTranslation();
  return (
    <Styled_FLATLIST
      _ref={_ref}
      style={{ flex: 1 }}
      data={lists}
      renderItem={({ item }: { item: List_PROPS }) => (
        <SwipeableExample
          leftBtn_ACTION={() => {
            PREPARE_listRename(item);
          }}
          rightBtn_ACTION={() => PREPADE_deleteList(item)}
        >
          <MyList_BTN
            list={item}
            onPress={() => SELECT_list(item)}
            highlighted={highlighted_ID === item.id}
          />
        </SwipeableExample>
      )}
      keyExtractor={(item) => item.id}
      ListFooterComponent={
        SHOW_bottomBtn ? (
          <Btn
            text={t("btn.createList")}
            iconLeft={<ICON_X color="primary" />}
            type="seethrough_primary"
            onPress={TOGGLE_createListModal}
          />
        ) : null
      }
    />
  );
}
