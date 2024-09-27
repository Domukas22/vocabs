//
//
//

import {
  List_MODEL,
  PublicVocab_MODEL,
  User_MODEL,
  Vocab_MODEL,
} from "@/src/db/models";
import USE_createMyVocab from "./USE_createPublicVocab";
import USE_updateMyVocab from "./USE_updatePublicVocab";
import USE_deletePublicVocab from "./USE_deletePublicVocab";
import USE_zustand from "../../../../zustand";
import { useToast } from "react-native-toast-notifications";
import { useSSR, useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { PublicVocabState_PROPS } from "./USE_publicVocabValues";
import USE_createPublicVocab from "@/src/db/vocabs/USE_createPublicVocab";
import USE_updatePublicVocab from "@/src/db/vocabs/USE_updatePublicVocab";

interface privateVocabAction_PROPS {
  vocab: PublicVocab_MODEL | undefined;
  modalValues: PublicVocabState_PROPS;
  // SET_vocabs: React.Dispatch<React.SetStateAction<PublicVocab_MODEL[]>>;
  TOGGLE_vocabModal: () => void;
  TOGGLE_modal: (whichModalToToggle: string) => void;
  HIGHLIGHT_vocab: (id: string) => void;
}

export default function USE_publicVocabActions({
  vocab,
  modalValues,
  TOGGLE_vocabModal,
  // SET_vocabs,
  TOGGLE_modal,
  HIGHLIGHT_vocab,
}: privateVocabAction_PROPS) {
  const { modal_TRs, modal_IMG, modal_DESC } = modalValues;
  const { t } = useTranslation();
  const toast = useToast();

  const { z_CREATE_publicVocab, z_UPDATE_publicVocab, z_DELETE_publicVocab } =
    USE_zustand();

  const { CREATE_publicVocab, IS_creatingPublicVocab } =
    USE_createPublicVocab();
  const { UPDATE_publicVocab, IS_updatingPublicVocab } =
    USE_updatePublicVocab();
  const { DELETE_publicVocab, IS_deletingPublicVocab } =
    USE_deletePublicVocab();

  const [allowAction, SET_allowAction] = useState(true);

  useEffect(() => {
    SET_allowAction(
      !IS_creatingPublicVocab &&
        !IS_updatingPublicVocab &&
        !IS_deletingPublicVocab
        ? true
        : false
    );
  }, [IS_creatingPublicVocab, IS_updatingPublicVocab, IS_deletingPublicVocab]);

  async function CREATE_vocab() {
    if (allowAction && !vocab) {
      const newVocab = await CREATE_publicVocab({
        image: modal_IMG,
        description: modal_DESC,
        translations: modal_TRs,
      });

      if (newVocab.success) {
        z_CREATE_publicVocab(newVocab.data);
        // SET_vocabs((prev) => [newVocab.data, ...prev]);
        TOGGLE_vocabModal();
        HIGHLIGHT_vocab(newVocab.data.id);
        toast.show(t("notifications.publicVocabCreated"), {
          type: "custom_success",
          duration: 2000,
        });
      }
    }
  }
  async function UPDATE_vocab() {
    if (allowAction && vocab) {
      const updatedVocab = await UPDATE_publicVocab({
        public_vocab_id: vocab.id,
        image: modal_IMG,
        description: modal_DESC,
        translations: modal_TRs,
      });
      if (updatedVocab.success) {
        z_UPDATE_publicVocab({
          vocab_id: updatedVocab.data.id,
          updatedVocabData: updatedVocab.data,
        });
        // SET_vocabs((vocabs) =>
        //   vocabs.map((v) => {
        //     if (v.id === updatedVocab.data.id) {
        //       return updatedVocab.data;
        //     }
        //     return v;
        //   })
        // );
        TOGGLE_vocabModal();
        HIGHLIGHT_vocab(vocab.id);
        toast.show(t("notifications.publicVocabUpdated"), {
          type: "custom_success",
          duration: 2000,
        });
      }
    }
  }

  async function DELETE_vocab() {
    if (allowAction && vocab) {
      const result = await DELETE_publicVocab({
        vocab_id: vocab.id,
      });
      if (result.success) {
        z_DELETE_publicVocab({ targetVocab_ID: vocab.id });
        // SET_vocabs((vocabs) => vocabs.filter((v) => v.id !== vocab.id));
        TOGGLE_modal("delete");
        TOGGLE_vocabModal();
        HIGHLIGHT_vocab(vocab.id);
      }
      toast.show(t("notifications.publicVocabDeleted"), {
        type: "custom_success",
        duration: 2000,
      });
    }
  }

  return {
    CREATE_vocab,
    UPDATE_vocab,
    DELETE_vocab,
    IS_creatingPublicVocab,
    IS_updatingPublicVocab,
    IS_deletingPublicVocab,
  };
}
