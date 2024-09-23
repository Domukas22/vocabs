//
//
//

import { USE_auth } from "@/src/context/Auth_CONTEXT";
import {
  List_MODEL,
  TranslationCreation_PROPS,
  Vocab_MODEL,
} from "@/src/db/models";
import USE_createVocab from "@/src/db/vocabs/CREATE_vocab";
import USE_updateVocab from "@/src/db/vocabs/UPDATE_vocab";
import { useState } from "react";
interface ManageVocabModal_PROPS {
  TOGGLE_modal: () => void;
  vocab: Vocab_MODEL | null;
  list: List_MODEL;
}
// Custom hook for managing vocab form
export default function USE_manageVocabForm(props: ManageVocabModal_PROPS) {
  const { vocab, list, TOGGLE_modal } = props;
  const { user } = USE_auth();
  const { CREATE_newVocab, IS_creatingVocab } = USE_createVocab();
  const { UPDATE_existingVocab, IS_updatingVocab } = USE_updateVocab();

  const [modal_LIST, SET_modalList] = useState(list);
  const [modal_DIFF, SET_modalDiff] = useState<1 | 2 | 3>(3);
  const [modal_IMG, SET_modalImg] = useState("");
  const [modal_DESC, SET_modalDesc] = useState("");
  const [modal_TRs, SET_modalTRs] = useState<TranslationCreation_PROPS[]>([]);

  async function UPDATE_vocab() {
    if (!IS_updatingVocab && vocab) {
      await UPDATE_existingVocab({
        vocab_id: vocab.id,
        user_id: user.id,
        list_id: modal_LIST.id,
        difficulty: modal_DIFF,
        image: modal_IMG,
        description: modal_DESC,
        translations: modal_TRs,
        toggleFn: TOGGLE_modal,
      });
    }
  }
  async function CREATE_vocab() {
    if (!IS_creatingVocab) {
      await CREATE_newVocab({
        user_id: user.id,
        list_id: modal_LIST.id,
        difficulty: modal_DIFF,
        image: modal_IMG,
        description: modal_DESC,
        translations: modal_TRs,
        toggleFn: TOGGLE_modal,
      });
    }
  }

  // return needed values and functions
  return {
    modal_TRs,
    modal_IMG,
    modal_DESC,
    modal_LIST,
    modal_DIFF,
    SET_modalTRs,
    SET_modalImg,
    SET_modalDesc,
    SET_modalList,
    SET_modalDiff,
    CREATE_vocab,
    UPDATE_vocab,
    IS_creatingVocab,
    IS_updatingVocab,
  };
}
