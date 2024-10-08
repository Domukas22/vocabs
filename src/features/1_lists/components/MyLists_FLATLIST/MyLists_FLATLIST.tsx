//
//
//

import Btn from "@/src/components/Btn/Btn";
import { ICON_X } from "@/src/components/icons/icons";
import MyList_BTN from "@/src/features/1_lists/components/MyList_BTN/MyList_BTN";
import Styled_FLATLIST from "@/src/components/Styled_FLATLIST/Styled_FLATLIST/Styled_FLATLIST";
import { List_MODEL } from "@/src/db/models";
import { useTranslation } from "react-i18next";
import SwipeableExample from "@/src/components/SwipeableExample/SwipeableExample";
import Label from "@/src/components/Label/Label";

export default function MyLists_FLATLIST({
  lists,
  SELECT_list,
  SHOW_bottomBtn,
  TOGGLE_createListModal,
  highlighted_ID,
  _ref,
  PREPARE_listRename,
  PREPADE_deleteList,
}) {
  const { t } = useTranslation();
  return (
    <Styled_FLATLIST
      _ref={_ref}
      style={{ flex: 1 }}
      data={lists}
      renderItem={({ item }: { item: List_MODEL }) => (
        <SwipeableExample
          leftBtn_ACTION={() => {
            console.log("FIRE");

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
