//
//
//

import { List_MODEL, User_MODEL, Vocab_MODEL } from "@/src/db/models";
import USE_createPrivateVocab from "@/src/db/vocabs/USE_createPrivateVocab";
import USE_updatePrivateVocab from "@/src/db/vocabs/USE_updatePrivateVocab";
import USE_deletePrivateVocab from "@/src/db/vocabs/USE_deletePrivateVocab";
import { PrivateVocabState_PROPS } from "./USE_privateVocabValues";
import USE_zustandStore from "@/src/zustand_store";

interface privateVocabAction_PROPS {
  user: User_MODEL;
  vocab: Vocab_MODEL | undefined;
  modalValues: PrivateVocabState_PROPS;
  SET_vocabs: React.Dispatch<React.SetStateAction<Vocab_MODEL[]>>;
  TOGGLE_vocabModal: () => void;
  TOGGLE_modal: (whichModalToToggle: string) => void;
  HIGHLIGHT_vocab: (id: string) => void;
}

export default function USE_privateVocabActions({
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

  const {
    CREATE_privateVocab_z,
    UPDATE_privateVocab_z,
    DELETE_privateVocab_z,
  } = USE_zustandStore();

  const { CREATE_privateVocab, IS_creatingVocab } = USE_createPrivateVocab();
  const { UPDATE_privateVocab, IS_updatingVocab } = USE_updatePrivateVocab();
  const { DELETE_privateVocab, IS_deleting } = USE_deletePrivateVocab();

  async function UPDATE_vocab() {
    if (!IS_updatingVocab && !IS_creatingVocab && !IS_deleting && vocab) {
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
        UPDATE_privateVocab_z(modal_LIST.id, vocab.id, updatedVocab.data);
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
      }
    }
  }
  async function CREATE_vocab() {
    if (!IS_updatingVocab && !IS_creatingVocab && !IS_deleting && !vocab) {
      const newVocab = await CREATE_privateVocab({
        user_id: user.id,
        list_id: modal_LIST.id,
        difficulty: modal_DIFF,
        image: modal_IMG,
        description: modal_DESC,
        translations: modal_TRs,
      });

      if (newVocab.success) {
        CREATE_privateVocab_z(modal_LIST.id, newVocab.data);
        SET_vocabs((prev) => [newVocab.data, ...prev]);
        TOGGLE_vocabModal();
        HIGHLIGHT_vocab(newVocab.data.id);
      }
    }
  }
  async function DELETE_vocab() {
    if (!IS_updatingVocab && !IS_creatingVocab && !IS_deleting && vocab) {
      const result = await DELETE_privateVocab({
        vocab_id: vocab.id,
      });
      if (result.success) {
        DELETE_privateVocab_z(modal_LIST.id, vocab.id);
        SET_vocabs((vocabs) => vocabs.filter((v) => v.id !== vocab.id));
        TOGGLE_modal("delete");
        TOGGLE_vocabModal();
        HIGHLIGHT_vocab(vocab.id);
      }
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
