//
//
//
import { useTranslation } from "react-i18next";
import Small_MODAL from "@/src/components/1_grouped/modals/Small_MODAL/Small_MODAL";
import Btn from "@/src/components/1_grouped/buttons/Btn/Btn";
import List_MODEL from "@/src/db/models/List_MODEL";

import { Styled_TEXT } from "@/src/components/1_grouped/texts/Styled_TEXT/Styled_TEXT";
import { MyColors } from "@/src/constants/MyColors";

interface DeleteListModal_PROPS {
  IS_open: boolean;
  list: List_MODEL | undefined;
  CLOSE_modal: () => void | undefined;
  onSuccess?: (deleted_LIST?: List_MODEL) => void | undefined;
}

export function DeleteList_MODAL({
  IS_open = false,
  list = undefined,
  CLOSE_modal = () => {},
  onSuccess = () => {},
}: DeleteListModal_PROPS) {
  const { t } = useTranslation();

  const del = async () => {
    await list?.SOFT_DELETE_list();
    if (onSuccess) {
      onSuccess();
    }
  };

  return (
    <Small_MODAL
      title={t("header.deleteList")}
      IS_open={IS_open}
      TOGGLE_modal={() => {
        // RESET_error();
        CLOSE_modal();
      }}
      btnLeft={
        <Btn
          text={t("btn.cancel")}
          onPress={() => {
            // RESET_error();
            CLOSE_modal();
          }}
          type="simple"
        />
      }
      btnRight={
        <Btn
          text={t("btn.confirmDelete")}
          // iconRight={
          //   IS_deletingList ? <ActivityIndicator color="black" /> : null
          // }
          onPress={del}
          type="action"
          style={{ flex: 1 }}
        />
      }
    >
      <Styled_TEXT style={{ color: MyColors.text_red }}>
        All vocabs of this list will be deleted as well
      </Styled_TEXT>
    </Small_MODAL>
  );
}
