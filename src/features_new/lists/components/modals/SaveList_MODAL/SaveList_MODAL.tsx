//
//
//
import { useTranslation } from "react-i18next";
import Small_MODAL from "@/src/components/1_grouped/modals/Small_MODAL/Small_MODAL";
import Btn from "@/src/components/1_grouped/buttons/Btn/Btn";
import { ActivityIndicator } from "react-native";
import Error_TEXT from "@/src/components/1_grouped/texts/Error_TEXT/Error_TEXT";
import { z_USE_myTargetSaveList } from "../../../hooks/zustand/z_USE_myTargetSaveList/z_USE_myTargetSaveList";
import { USE_saveList } from "../../../hooks/USE_saveList/USE_saveList";
import { useCallback } from "react";

// 🔴🔴 TODO ==> Finish this modal and implement copying function

export function SaveList_MODAL({
  IS_open,
  CLOSE_modal,
}: {
  IS_open: boolean;
  CLOSE_modal: () => void;
}) {
  const { t } = useTranslation();
  const { z_myTargetSave_LIST } = z_USE_myTargetSaveList();
  const { RESET_error, SAVE_list, error, loading } = USE_saveList();

  const save = useCallback(
    () =>
      SAVE_list(z_myTargetSave_LIST?.id || "", () => {
        CLOSE_modal();
      }),
    [SAVE_list, CLOSE_modal]
  );

  return (
    <Small_MODAL
      title={t("header.copyListAndVocabs")}
      IS_open={IS_open}
      TOGGLE_modal={() => {
        if (!loading) {
          RESET_error();
          CLOSE_modal();
        }
      }}
      btnLeft={
        <Btn
          text={t("btn.cancel")}
          onPress={() => {
            if (!loading) {
              RESET_error();
              CLOSE_modal();
            }
          }}
          type="simple"
        />
      }
      btnRight={
        <Btn
          text={!loading ? t("btn.confirmListCopy") : ""}
          iconRight={loading ? <ActivityIndicator color="black" /> : null}
          onPress={save}
          type="action"
          style={{ flex: 1 }}
        />
      }
    >
      {error && <Error_TEXT text="error" />}
    </Small_MODAL>
  );
}
