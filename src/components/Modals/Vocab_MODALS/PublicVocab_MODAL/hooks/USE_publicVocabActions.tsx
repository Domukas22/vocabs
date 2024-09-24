//
//
//

import { PublicVocab_MODEL, User_MODEL, Vocab_MODEL } from "@/src/db/models";
import USE_createPrivateVocab from "@/src/db/vocabs/USE_createPrivateVocab";

import { PrivateVocabState_PROPS } from "../../PrivateVocab_MODAL/hooks/USE_privateVocabValues";
import { PublicVocabState_PROPS } from "./USE_publicVocabValues";
import USE_createPublicVocab from "@/src/db/vocabs/USE_createPublicVocab";
import USE_updatePublicVocab from "@/src/db/vocabs/USE_updatePublicVocab";
import USE_deletePublicVocab from "@/src/db/vocabs/USE_deletePublicVocab";

export default function USE_publicVocabActions({
  vocab,
  modalValues,
  TOGGLE_vocabModal,
}: {
  user: User_MODEL;
  vocab: PublicVocab_MODEL | undefined;
  modalValues: PublicVocabState_PROPS;
  TOGGLE_vocabModal: () => void;
}) {
  const { modal_TRs, modal_IMG, modal_DESC } = modalValues;

  const { CREATE_publicVocab, IS_creatingPublicVocab } =
    USE_createPublicVocab();
  const { UPDATE_publicVocab, IS_updatingPublicVocab } =
    USE_updatePublicVocab();
  const { DELETE_publicVocab, IS_deletingPublicVocab } =
    USE_deletePublicVocab();

  async function UPDATE_vocab() {
    if (
      !IS_updatingPublicVocab &&
      !IS_creatingPublicVocab &&
      !IS_deletingPublicVocab &&
      vocab
    ) {
      await UPDATE_publicVocab({
        public_vocab_id: vocab.id,
        image: modal_IMG,
        description: modal_DESC,
        translations: modal_TRs,
        toggleFn: TOGGLE_vocabModal,
      });
    }
  }
  async function CREATE_vocab() {
    if (
      !IS_updatingPublicVocab &&
      !IS_creatingPublicVocab &&
      !IS_deletingPublicVocab &&
      !vocab
    ) {
      await CREATE_publicVocab({
        image: modal_IMG,
        description: modal_DESC,
        translations: modal_TRs,
        toggleFn: TOGGLE_vocabModal,
      });
    }
  }
  async function DELETE_vocab() {
    if (
      !IS_updatingPublicVocab &&
      !IS_creatingPublicVocab &&
      !IS_deletingPublicVocab &&
      vocab
    ) {
      await DELETE_publicVocab({
        public_vocab_id: vocab.id,
        toggleFn: TOGGLE_vocabModal,
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
