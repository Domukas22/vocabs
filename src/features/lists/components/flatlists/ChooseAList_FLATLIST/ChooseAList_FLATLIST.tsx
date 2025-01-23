//
//
//

import Btn from "@/src/components/1_grouped/buttons/Btn/Btn";
import { ICON_checkMark, ICON_X } from "@/src/components/1_grouped/icons/icons";
import Styled_FLASHLIST from "@/src/components/3_other/Styled_FLASHLIST/Styled_FLASHLIST";

import { useTranslation } from "react-i18next";
import React from "react";
import List_MODEL from "@/src/db/models/List_MODEL";
import { withObservables } from "@nozbe/watermelondb/react";
import { Lists_DB } from "@/src/db";
import { Q } from "@nozbe/watermelondb";

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
    <Styled_FLASHLIST
      gap={8}
      data={lists}
      extraData={selected_LIST}
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
          style={[{ flex: 1 }]}
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
