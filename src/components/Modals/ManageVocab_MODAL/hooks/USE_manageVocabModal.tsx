//
//
//

import { USE_auth } from "@/src/context/Auth_CONTEXT";
import {
  Language_MODEL,
  List_MODEL,
  TranslationCreation_PROPS,
  Vocab_MODEL,
} from "@/src/db/models";
import USE_createVocab from "@/src/db/vocabs/CREATE_vocab";
import USE_updateVocab from "@/src/db/vocabs/UPDATE_vocab";
import { useCallback, useMemo, useState } from "react";
import GET_defaultTranslations from "../helpers/GET_defaultTranslations";
import GET_handledLangs from "../helpers/SELECT_languages";
interface ManageVocabModal_PROPS {
  TOGGLE_modal: () => void;
  vocab: Vocab_MODEL | undefined;
  list: List_MODEL;
}
// Custom hook for managing vocab form
export default function USE_manageVocabModal(props: ManageVocabModal_PROPS) {
  const { vocab, list, TOGGLE_modal } = props;
  const { user } = USE_auth();
  const { CREATE_newVocab, IS_creatingVocab } = USE_createVocab();
  const { UPDATE_existingVocab, IS_updatingVocab } = USE_updateVocab();

  const [modal_LIST, SET_modalList] = useState<List_MODEL>(list);
  const [modal_DIFF, SET_modalDiff] = useState<1 | 2 | 3>(3);
  const [modal_IMG, SET_modalImg] = useState<string>("");
  const [modal_DESC, SET_modalDesc] = useState<string>("");
  const [modal_TRs, SET_modalTRs] = useState<TranslationCreation_PROPS[]>([]);

  const activeLangIDs = useMemo(
    () => modal_TRs?.filter((t) => t.lang_id).map((t) => t.lang_id) || [],
    [modal_TRs]
  );

  const [target_LANG, SET_targetLang] = useState<Language_MODEL | undefined>(
    undefined
  );

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
  function CLEAR_modal() {
    SET_modalList(list);
    SET_modalImg("");
    SET_modalDesc("");
    SET_modalDiff(3);
    SET_modalTRs(GET_defaultTranslations());
  }
  function POPULATE_modal({
    vocab,
    list,
  }: {
    list: List_MODEL;
    vocab: Vocab_MODEL | undefined;
  }) {
    SET_modalList(list);
    SET_modalImg(vocab?.image || "");
    SET_modalDesc(vocab?.description || "");
    SET_modalDiff(vocab?.difficulty || 3);
    SET_modalTRs(vocab?.translations || GET_defaultTranslations());
  }
  const REMOVE_lang = useCallback(
    (lang_id: string) => {
      const hasOnly2Translations = modal_TRs?.length === 2;
      if (!hasOnly2Translations) {
        SET_modalTRs((prev) => prev?.filter((tr) => tr.lang_id !== lang_id));
      }
    },
    [modal_TRs]
  );
  const HANLDE_languages = useCallback(
    (newLangSelection: Language_MODEL[]) => {
      SET_modalTRs(
        GET_handledLangs({
          newLangSelection,
          modal_TRs,
        })
      );
    },
    [modal_TRs]
  );

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
    CLEAR_modal,
    POPULATE_modal,
    REMOVE_lang,
    HANLDE_languages,
    activeLangIDs,
    target_LANG,
    SET_targetLang,
  };
}
