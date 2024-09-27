//
//
//

import { List_MODEL, User_MODEL, Vocab_MODEL } from "@/src/db/models";
import USE_createMyVocab from "./USE_createMyVocab";
import USE_updateMyVocab from "./USE_updateMyVocab";
import USE_deleteMyVocab from "./USE_deleteMyVocab";
import { PrivateVocabState_PROPS } from "./USE_myVocabValues";
import USE_zustand from "../../../../zustand";
import { useToast } from "react-native-toast-notifications";
import { useSSR, useTranslation } from "react-i18next";
import { useEffect, useState } from "react";

interface privateVocabAction_PROPS {
  user: User_MODEL;
  vocab: Vocab_MODEL | undefined;
  modalValues: PrivateVocabState_PROPS;
  SET_vocabs: React.Dispatch<React.SetStateAction<Vocab_MODEL[]>>;
  TOGGLE_vocabModal: () => void;
  TOGGLE_modal: (whichModalToToggle: string) => void;
  HIGHLIGHT_vocab: (id: string) => void;
}

export default function USE_myVocabActions({
  user,
  vocab,
  modalValues,
  TOGGLE_vocabModal,
  SET_vocabs,
  TOGGLE_modal,
  HIGHLIGHT_vocab,
}: privateVocabAction_PROPS) {
  const { modal_TRs, modal_IMG, modal_DESC, modal_LIST, modal_DIFF } =
    modalValues;
  const { t } = useTranslation();
  const toast = useToast();

  const {
    z_CREATE_privateVocab,
    z_UPDATE_privateVocab,
    z_DELETE_privateVocab,
  } = USE_zustand();

  const { CREATE_privateVocab, IS_creatingVocab } = USE_createMyVocab();
  const { UPDATE_privateVocab, IS_updatingVocab } = USE_updateMyVocab();
  const { DELETE_privateVocab, IS_deleting } = USE_deleteMyVocab();

  const [allowAction, SET_allowAction] = useState(true);

  useEffect(() => {
    SET_allowAction(
      !IS_updatingVocab && !IS_creatingVocab && !IS_deleting ? true : false
    );
  }, [IS_creatingVocab, IS_updatingVocab, IS_deleting]);

  async function UPDATE_vocab() {
    if (allowAction && vocab) {
      const updatedVocab = await UPDATE_privateVocab({
        vocab_id: vocab.id,
        user_id: user.id,
        list_id: modal_LIST.id,
        difficulty: modal_DIFF,
        image: modal_IMG,
        description: modal_DESC,
        translations: modal_TRs,
      });
      if (updatedVocab.success) {
        z_UPDATE_privateVocab(modal_LIST.id, vocab.id, updatedVocab.data);
        SET_vocabs((vocabs) =>
          vocabs.map((v) => {
            if (v.id === updatedVocab.data.id) {
              return updatedVocab.data;
            }
            return v;
          })
        );
        TOGGLE_vocabModal();
        HIGHLIGHT_vocab(vocab.id);
        toast.show(t("notifications.vocabUpdated"), {
          type: "custom_success",
          duration: 2000,
        });
      }
    }
  }
  async function CREATE_vocab() {
    if (allowAction && !vocab) {
      const newVocab = await CREATE_privateVocab({
        user_id: user.id,
        list_id: modal_LIST.id,
        difficulty: modal_DIFF,
        image: modal_IMG,
        description: modal_DESC,
        translations: modal_TRs,
      });

      if (newVocab.success) {
        z_CREATE_privateVocab(modal_LIST.id, newVocab.data);
        SET_vocabs((prev) => [newVocab.data, ...prev]);
        TOGGLE_vocabModal();
        HIGHLIGHT_vocab(newVocab.data.id);
        toast.show(t("notifications.vocabCreated"), {
          type: "custom_success",
          duration: 2000,
        });
      }
    }
  }
  async function DELETE_vocab() {
    if (allowAction && vocab) {
      const result = await DELETE_privateVocab({
        vocab_id: vocab.id,
      });
      if (result.success) {
        z_DELETE_privateVocab(modal_LIST.id, vocab.id);
        SET_vocabs((vocabs) => vocabs.filter((v) => v.id !== vocab.id));
        TOGGLE_modal("delete");
        TOGGLE_vocabModal();
        HIGHLIGHT_vocab(vocab.id);
      }
      toast.show(t("notifications.vocabDeleted"), {
        type: "custom_success",
        duration: 2000,
      });
    }
  }

  return {
    CREATE_vocab,
    UPDATE_vocab,

    DELETE_vocab,
    IS_creatingVocab,
    IS_updatingVocab,

    IS_deleting,
  };
}
