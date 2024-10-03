//
//
//

import { User_MODEL, Vocab_MODEL } from "@/src/db/models";

import USE_deleteVocab from "./USE_deleteVocab";
import { PrivateVocabState_PROPS } from "./USE_myVocabValues";
import USE_zustand from "@/src/zustand";
import { useToast } from "react-native-toast-notifications";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import USE_createVocab from "./USE_createVocab";
import USE_updateVocab from "./USE_updateVocab";

interface privateVocabAction_PROPS {
  user: User_MODEL;
  vocab: Vocab_MODEL | undefined;
  modalValues: PrivateVocabState_PROPS;
  SET_vocabs: React.Dispatch<React.SetStateAction<Vocab_MODEL[]>>;
  TOGGLE_vocabModal: () => void;
  HIGHLIGHT_vocab: (id: string) => void;
  is_public?: boolean;
}

export default function USE_myVocabActions({
  user,
  vocab,
  modalValues,
  TOGGLE_vocabModal,
  SET_vocabs,
  HIGHLIGHT_vocab,
  is_public = false,
}: privateVocabAction_PROPS) {
  const { modal_TRs, modal_IMG, modal_DESC, modal_LIST, modal_DIFF } =
    modalValues;
  const { t } = useTranslation();
  const toast = useToast();

  const {
    z_CREATE_privateVocab,
    z_CREATE_publicVocab,
    z_UPDATE_privateVocab,
    z_UPDATE_publicVocab,
    z_DELETE_privateVocab,
    z_DELETE_publicVocab,
  } = USE_zustand();

  const { CREATE_vocab, IS_creatingVocab } = USE_createVocab();
  const { UPDATE_vocab, IS_updatingVocab } = USE_updateVocab();
  const { DELETE_vocab, IS_deletingVocab } = USE_deleteVocab();

  const [allowAction, SET_allowAction] = useState(true);

  useEffect(() => {
    SET_allowAction(
      !IS_updatingVocab && !IS_creatingVocab && !IS_deletingVocab ? true : false
    );
  }, [IS_creatingVocab, IS_updatingVocab, IS_deletingVocab]);

  async function update() {
    if (allowAction && vocab) {
      const updatedVocab = await UPDATE_vocab(
        {
          vocab_id: vocab.id,
          user_id: user?.id,
          list_id: modal_LIST?.id,
          difficulty: modal_DIFF,
          image: modal_IMG,
          description: modal_DESC,
          translations: modal_TRs,
        },
        user.is_admin,
        is_public
      );
      if (updatedVocab.success) {
        if (is_public) {
          z_UPDATE_publicVocab({
            vocab_id: updatedVocab.data.id,
            updatedVocabData: updatedVocab.data,
          });
        } else {
          z_UPDATE_privateVocab(modal_LIST?.id, vocab.id, updatedVocab.data);
        }
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
          type: "green",
          duration: 5000,
        });
      }
    }
  }
  async function create() {
    if (allowAction && !vocab) {
      const newVocab = await CREATE_vocab({
        user_id: user?.id,
        list_id: modal_LIST?.id,
        difficulty: modal_DIFF,
        image: modal_IMG,
        description: modal_DESC,
        translations: modal_TRs,
        is_public,
        IS_admin: user.is_admin,
      });

      if (newVocab.success) {
        if (is_public) {
          z_CREATE_publicVocab(newVocab.data);
        } else {
          z_CREATE_privateVocab(modal_LIST?.id, newVocab.data);
        }
        SET_vocabs((prev) => [newVocab.data, ...prev]);
        TOGGLE_vocabModal();
        HIGHLIGHT_vocab(newVocab.data.id);
        toast.show(t("notifications.vocabCreated"), {
          type: "green",
          duration: 5000,
        });
      }
    }
  }
  async function delete_V() {
    if (allowAction && vocab) {
      const result = await DELETE_vocab({
        vocab_id: vocab.id,
        user_id: user.id,
        list_id: modal_LIST?.id,
        is_public: is_public,
        is_admin: user.is_admin,
      });
      if (result.success) {
        if (is_public) {
          z_DELETE_publicVocab({ targetVocab_ID: vocab.id });
        } else {
          z_DELETE_privateVocab(modal_LIST?.id, vocab.id);
        }
        SET_vocabs((vocabs) => vocabs.filter((v) => v.id !== vocab.id));
        TOGGLE_vocabModal();
        HIGHLIGHT_vocab(vocab.id);
      }
      toast.show(t("notifications.vocabDeleted"), {
        type: "green",
        duration: 5000,
      });
    }
  }

  return {
    create,
    update,

    delete_V,
    IS_creatingVocab,
    IS_updatingVocab,

    IS_deletingVocab,
  };
}
