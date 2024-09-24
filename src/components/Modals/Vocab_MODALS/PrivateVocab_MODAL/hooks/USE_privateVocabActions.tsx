//
//
//

import { User_MODEL, Vocab_MODEL } from "@/src/db/models";
import USE_createPrivateVocab from "@/src/db/vocabs/USE_createPrivateVocab";
import USE_updatePrivateVocab from "@/src/db/vocabs/USE_updatePrivateVocab";
import USE_deletePrivateVocab from "@/src/db/vocabs/USE_deletePrivateVocab";
import { PrivateVocabState_PROPS } from "./USE_privateVocabValues";

export default function USE_privateVocabActions({
  user,
  vocab,
  modalValues,
  TOGGLE_vocabModal,
}: {
  user: User_MODEL;
  vocab: Vocab_MODEL | undefined;
  modalValues: PrivateVocabState_PROPS;
  TOGGLE_vocabModal: () => void;
}) {
  const { modal_TRs, modal_IMG, modal_DESC, modal_LIST, modal_DIFF } =
    modalValues;

  const { CREATE_privateVocab, IS_creatingVocab } = USE_createPrivateVocab();
  const { UPDATE_privateVocab, IS_updatingVocab } = USE_updatePrivateVocab();
  const { DELETE_privateVocab, IS_deleting } = USE_deletePrivateVocab();

  async function UPDATE_vocab() {
    if (!IS_updatingVocab && !IS_creatingVocab && !IS_deleting && vocab) {
      await UPDATE_privateVocab({
        vocab_id: vocab.id,
        user_id: user.id,
        list_id: modal_LIST.id,
        difficulty: modal_DIFF,
        image: modal_IMG,
        description: modal_DESC,
        translations: modal_TRs,
        toggleFn: TOGGLE_vocabModal,
      });
    }
  }
  async function CREATE_vocab() {
    if (!IS_updatingVocab && !IS_creatingVocab && !IS_deleting && !vocab) {
      await CREATE_privateVocab({
        user_id: user.id,
        list_id: modal_LIST.id,
        difficulty: modal_DIFF,
        image: modal_IMG,
        description: modal_DESC,
        translations: modal_TRs,
        toggleFn: TOGGLE_vocabModal,
      });
    }
  }
  async function DELETE_vocab() {
    if (!IS_updatingVocab && !IS_creatingVocab && !IS_deleting && vocab) {
      await DELETE_privateVocab({
        vocab_id: vocab.id,
        toggleFn: TOGGLE_vocabModal,
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
