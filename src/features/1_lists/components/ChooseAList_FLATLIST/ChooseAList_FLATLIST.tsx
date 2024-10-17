//
//
//

import Btn from "@/src/components/Btn/Btn";
import { ICON_checkMark, ICON_X } from "@/src/components/icons/icons";
import { MyList_BTN } from "@/src/features/1_lists/components/MyList_BTN/MyList_BTN";
import Styled_FLATLIST from "@/src/components/Styled_FLATLIST/Styled_FLATLIST/Styled_FLATLIST";

import { useTranslation } from "react-i18next";
import SwipeableExample from "@/src/components/SwipeableExample/SwipeableExample";
import Label from "@/src/components/Label/Label";
import React from "react";
import { FlatList, View } from "react-native";
import { List_MODEL } from "@/src/db/watermelon_MODELS";
import { Styled_TEXT } from "@/src/components/Styled_TEXT/Styled_TEXT";
import { withObservables } from "@nozbe/watermelondb/react";
import { Lists_DB } from "@/src/db";
import { USER_ID } from "@/src/constants/globalVars";
import { Q } from "@nozbe/watermelondb";
import { take } from "@nozbe/watermelondb/QueryDescription";

interface MyListsFlatlist_PROPS {
  lists: List_MODEL[];
  selected_LIST: List_MODEL;
  SELECT_list: (list: List_MODEL) => void;
  TOGGLE_createListModal: () => void;
}

function _ChooseAList_FLATLIST({
  lists,
  selected_LIST,
  SELECT_list,
  TOGGLE_createListModal,
}: MyListsFlatlist_PROPS) {
  const { t } = useTranslation();

  return (
    <Styled_FLATLIST
      style={{ flex: 1 }}
      data={lists}
      renderItem={({ item }: { item: List_MODEL }) => (
        <Btn
          text={item.name}
          iconRight={
            selected_LIST?.id === item.id && <ICON_checkMark color="primary" />
          }
          onPress={() => {
            SELECT_list(item);
          }}
          type={selected_LIST?.id === item.id ? "active" : "simple"}
          style={[{ flex: 1, marginBottom: 8 }]}
          text_STYLES={{ flex: 1 }}
        />
      )}
      keyExtractor={(item) => item.id}
      ListFooterComponent={
        <Btn
          type="seethrough_primary"
          iconLeft={<ICON_X color="primary" />}
          text={t("btn.createList")}
          onPress={TOGGLE_createListModal}
        />
      }
    />
  );
}
const enhance_allLists = withObservables(
  ["user_id"],
  ({ user_id }: { user_id: string }) => ({
    lists: Lists_DB.query(
      Q.where("user_id", user_id),
      Q.sortBy("created_at", Q.asc)
    ),
  })
);
export const ChooseAList_FLATLIST = enhance_allLists(_ChooseAList_FLATLIST);
