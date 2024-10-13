//
//
//

import SelectMyList_MODAL from "@/src/features/1_lists/components/SelectMyList_MODAL/SelectMyList_MODAL";
import USE_createVocab from "../../../hooks/USE_createVocab";
import { useState } from "react";
import { tr_PROPS } from "@/src/db/props";
import USE_zustand from "@/src/zustand";
import { CreateMyVocabData_PROPS } from "../CreateMyVocab_MODAL/CreateMyVocab_MODAL";
import {
  List_MODEL,
  Vocab_MODEL,
  User_MODEL,
} from "@/src/db/watermelon_MODELS";

interface SavePublicVocabToListModal_PROPS {
  vocab: Vocab_MODEL | undefined;
  trs: tr_PROPS[] | undefined;
  IS_open: boolean;
  TOGGLE_open: () => void;
  user: User_MODEL;
  onSuccess: (new_VOCAB: Vocab_MODEL) => void;
}

export default function SavePublicVocabToList_MODAL({
  vocab,
  trs,
  IS_open,
  user,
  onSuccess,
  TOGGLE_open,
}: SavePublicVocabToListModal_PROPS) {
  const { CREATE_vocab, IS_creatingVocab, db_ERROR, RESET_dbError } =
    USE_createVocab();

  const { z_lists } = USE_zustand();

  const create = async (list: List_MODEL) => {
    const result = await CREATE_vocab({
      user,
      list,
      difficulty: 3,
      description: vocab?.description,
      translations: trs || [],
      is_public: false,
      onSuccess: (new_VOCAB: Vocab_MODEL) => {
        onSuccess(new_VOCAB);
      },
    });

    if (!result.success) {
      console.error(result.msg);
    }
  };

  return (
    <SelectMyList_MODAL
      open={IS_open}
      title="Saved vocab to list"
      submit_ACTION={(list: List_MODEL) => {
        if (list) create(list);
      }}
      cancel_ACTION={() => {
        if (!IS_creatingVocab) {
          TOGGLE_open();
        }
      }}
      IS_inAction={IS_creatingVocab}
      current_LIST={z_lists[0] || undefined}
    />
  );
}
