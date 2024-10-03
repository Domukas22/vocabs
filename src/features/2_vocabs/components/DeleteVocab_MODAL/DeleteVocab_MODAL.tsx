//
//
//

import { useTranslation } from "react-i18next";
import Small_MODAL from "@/src/components/Modals/Small_MODAL/Small_MODAL";
import Btn from "@/src/components/Btn/Btn";
import { ActivityIndicator } from "react-native";
import { ToastProvider, useToast } from "react-native-toast-notifications";
import { User_MODEL, Vocab_MODEL } from "@/src/db/models";
import USE_zustand from "@/src/zustand";
import { useEffect, useState } from "react";
import USE_deleteVocab from "../../hooks/USE_deleteVocab";
import { USE_auth } from "@/src/context/Auth_CONTEXT";
import ALLOW_vocabDelete from "../../utils/ALLOW_vocabDeletion";
import Error_TEXT from "@/src/components/Error_TEXT/Error_TEXT";

interface DeleteVocabModal_PROPS {
  IS_open: boolean;
  is_public?: boolean;
  vocab_id: string | undefined;
  list_id?: string | undefined;
  CLOSE_modal: () => void | undefined;
  RESET_targetVocab: () => void | undefined;
  REMOVE_fromPrintedVocabs?: (id: string) => void | undefined;
}

export default function DeleteVocab_MODAL({
  IS_open = false,
  is_public = false,
  vocab_id = undefined,
  list_id = undefined,
  CLOSE_modal = () => {},
  RESET_targetVocab = () => {},
  REMOVE_fromPrintedVocabs = () => {},
}: DeleteVocabModal_PROPS) {
  const { t } = useTranslation();
  const { user } = USE_auth();
  const toast = useToast();

  const { z_DELETE_privateVocab, z_DELETE_publicVocab } = USE_zustand();
  const { DELETE_vocab, IS_deletingVocab } = USE_deleteVocab();

  const [error, SET_error] = useState({
    value: false,
    msg: "",
    internalMsg: "",
  });

  useEffect(() => {
    SET_error({ value: false, msg: "", internalMsg: "" });
  }, [IS_open]);

  const _delete = async () => {
    const { allow, internalMsg } = ALLOW_vocabDelete({
      is_public,
      user,
      vocab_id,
      list_id,
    });

    if (!allow) {
      SET_error({
        value: true,
        msg: "Something went wrong with the deletion. Try opening / closing or reloading the app. We are sorry for the trouble. This error was recorded and sent for review.",
        internalMsg: internalMsg,
      });
      console.log(internalMsg);
    }

    if (allow) {
      const result = await DELETE_vocab({
        user_id: user?.id,
        is_admin: user?.is_admin || false,
        list_id,
        vocab_id: vocab_id || "",
        is_public,
      });
      if (result.success) {
        if (!is_public && list_id) {
          z_DELETE_privateVocab(list_id, vocab_id || "");
        }
        if (is_public && user?.is_admin) {
          z_DELETE_publicVocab({ targetVocab_ID: vocab_id || "" });
        }
        if (REMOVE_fromPrintedVocabs) {
          REMOVE_fromPrintedVocabs(vocab_id || "");
        }
        if (RESET_targetVocab) {
          RESET_targetVocab();
        }
        toast.show(t("notifications.vocabDeleted"), {
          type: "green",
          duration: 2000,
        });
        CLOSE_modal();
        return;
      }
      if (!result.success) {
        if (result.msg) {
          SET_error({
            value: true,
            msg: "Something went wrong with the deletion. Try opening / closing or reloading the app. We are sorry for the trouble. This error was recorded and sent for review.",
            internalMsg: result.msg,
          });
        }
      }
    }
  };

  return (
    <Small_MODAL
      title={t("modal.deleteVocabConfirmation.header")}
      {...{
        IS_open: IS_open,
        TOGGLE_modal: () => {
          if (!IS_deletingVocab) CLOSE_modal();
        },
        btnLeft: (
          <Btn
            text={t("btn.cancel")}
            onPress={() => {
              if (!IS_deletingVocab) CLOSE_modal();
            }}
            type="simple"
          />
        ),
        btnRight: (
          <Btn
            text={!IS_deletingVocab ? t("btn.confirmDelete") : ""}
            iconRight={
              IS_deletingVocab ? <ActivityIndicator color="black" /> : null
            }
            onPress={_delete}
            type="action"
            style={{ flex: 1 }}
          />
        ),
      }}
    >
      {error.value && <Error_TEXT>{error.msg}</Error_TEXT>}
    </Small_MODAL>
  );
}
