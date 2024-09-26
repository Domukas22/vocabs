//
//
//

import { List_MODEL, User_MODEL } from "@/src/db/models";
import USE_deleteList from "./USE_deleteList";
import USE_renameList from "./USE_renameList";
import USE_updateDefaultListTRs from "./USE_updateDefaultListTRs";

interface PrivateListAction_PROPS {
  afterDelete_ACTION: () => void;
  afterRename_ACTION: () => void;
  afterDefaultTrEdit_ACTION: () => void;
}

export default function USE_myListActions({
  afterDelete_ACTION,
  afterRename_ACTION,
  afterDefaultTrEdit_ACTION,
}: PrivateListAction_PROPS) {
  const { DELETE_list, IS_deletingList, deleteList_ERROR } = USE_deleteList();
  const { RENAME_list, IS_renamingList, renameList_ERROR } = USE_renameList();
  const {
    UPDATE_defaultListTRs,
    IS_updatingDefaultListTRs,
    updateDefaultTRs_ERROR,
  } = USE_updateDefaultListTRs();

  // async function UPDATE_vocab() {
  //   if (!IS_updatingVocab && !IS_creatingVocab && !IS_deleting && vocab) {
  //     const updatedVocab = await UPDATE_privateVocab({
  //       vocab_id: vocab.id,
  //       user_id: user.id,
  //       list_id: modal_LIST.id,
  //       difficulty: modal_DIFF,
  //       image: modal_IMG,
  //       description: modal_DESC,
  //       translations: modal_TRs,
  //     });
  //     if (updatedVocab.success) {
  //       UPDATE_privateVocab_z(modal_LIST.id, vocab.id, updatedVocab.data);
  //       SET_vocabs((vocabs) =>
  //         vocabs.map((v) => {
  //           if (v.id === updatedVocab.data.id) {
  //             return updatedVocab.data;
  //           }
  //           return v;
  //         })
  //       );
  //       TOGGLE_vocabModal();
  //       HIGHLIGHT_vocab(vocab.id);
  //       toast.show(t("notifications.vocabUpdated"), {
  //         type: "custom_success",
  //         duration: 2000,
  //       });
  //     }
  //   }
  // }
  // async function CREATE_vocab() {
  //   if (!IS_updatingVocab && !IS_creatingVocab && !IS_deleting && !vocab) {
  //     const newVocab = await CREATE_privateVocab({
  //       user_id: user.id,
  //       list_id: modal_LIST.id,
  //       difficulty: modal_DIFF,
  //       image: modal_IMG,
  //       description: modal_DESC,
  //       translations: modal_TRs,
  //     });

  //     if (newVocab.success) {
  //       CREATE_privateVocab_z(modal_LIST.id, newVocab.data);
  //       SET_vocabs((prev) => [newVocab.data, ...prev]);
  //       TOGGLE_vocabModal();
  //       HIGHLIGHT_vocab(newVocab.data.id);
  //       toast.show(t("notifications.vocabCreated"), {
  //         type: "custom_success",
  //         duration: 2000,
  //       });
  //     }
  //   }
  // }
  async function DELETE_privateList(targetList_ID: string) {
    if (
      targetList_ID &&
      !IS_deletingList &&
      !IS_renamingList &&
      !IS_updatingDefaultListTRs
    ) {
      const result = await DELETE_list(targetList_ID);
      if (result.success) afterDelete_ACTION();
    }
  }
  async function RENAME_privateList(new_NAME: string, targetList_ID: string) {
    if (
      targetList_ID &&
      new_NAME &&
      !IS_deletingList &&
      !IS_renamingList &&
      !IS_updatingDefaultListTRs
    ) {
      const result = await RENAME_list(targetList_ID, new_NAME);
      if (result.success) afterRename_ACTION();
    }
  }
  async function UPDATE_privateListDefaultTRs(
    targetList_ID: string,
    new_TRs: string[]
  ) {
    if (
      targetList_ID &&
      !IS_deletingList &&
      !IS_renamingList &&
      !IS_updatingDefaultListTRs
    ) {
      const result = await UPDATE_defaultListTRs(targetList_ID, new_TRs);
      if (result.success) afterDefaultTrEdit_ACTION();
    }
  }

  return {
    RENAME_privateList,
    UPDATE_privateListDefaultTRs,
    DELETE_privateList,
    IS_renamingList,
    IS_updatingDefaultListTRs,
    IS_deletingList,
  };
}
