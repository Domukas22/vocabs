//
//
//
import { useTranslation } from "react-i18next";
import Small_MODAL from "@/src/components/1_grouped/modals/Small_MODAL/Small_MODAL";
import Btn from "@/src/components/1_grouped/buttons/Btn/Btn";

import { Styled_TEXT } from "@/src/components/1_grouped/texts/Styled_TEXT/Styled_TEXT";
import { MyColors } from "@/src/constants/MyColors";
import { z_USE_myOneList } from "@/src/features_new/lists/hooks/zustand/z_USE_myOneList/z_USE_myOneList";
import { useMemo } from "react";
import { z_USE_currentActions } from "@/src/hooks/zustand/z_USE_currentActions/z_USE_currentActions";
import { ActivityIndicator } from "react-native";
import { USE_deleteList } from "@/src/features_new/lists/hooks/actions/USE_deleteList/USE_deleteList";
import { useRouter } from "expo-router";

// TODO --> Finish deleting list function

interface DeleteListModal_PROPS {
  IS_open: boolean;
  CLOSE_modal: () => void;
}

export function DeleteList_MODAL({
  IS_open = false,
  CLOSE_modal = () => {},
}: DeleteListModal_PROPS) {
  const { t } = useTranslation();
  const { z_myOneList } = z_USE_myOneList();

  const { z_currentActions, IS_inAction } = z_USE_currentActions();

  const IS_deletingList = useMemo(
    () => IS_inAction("list", z_myOneList?.id || "", "deleting"),
    [z_currentActions, z_myOneList?.id]
  );

  const { DELETE_list } = USE_deleteList();
  const router = useRouter();

  return (
    <Small_MODAL
      title={t("header.deleteList")}
      IS_open={IS_open}
      TOGGLE_modal={() => {
        // RESET_error();
        CLOSE_modal();
      }}
      btnLeft={
        <Btn text={t("btn.cancel")} onPress={CLOSE_modal} type="simple" />
      }
      btnRight={
        <Btn
          text={!IS_deletingList ? t("btn.confirmDelete") : ""}
          iconRight={
            IS_deletingList ? <ActivityIndicator color="black" /> : null
          }
          onPress={() =>
            DELETE_list(z_myOneList?.id || "", {
              onSuccess: () => {
                CLOSE_modal();
                router.back();
              },
            })
          }
          type="action"
          style={{ flex: 1 }}
        />
      }
    >
      <Styled_TEXT style={{ color: MyColors.text_yellow }}>
        {t("confirmation.paragraph.deleteList")}
      </Styled_TEXT>
    </Small_MODAL>
  );
}
