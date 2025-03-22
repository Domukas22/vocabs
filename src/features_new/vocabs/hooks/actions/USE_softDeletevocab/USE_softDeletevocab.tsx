//
//
//

import { z_USE_currentActions } from "@/src/hooks/zustand/z_USE_currentActions/z_USE_currentActions";
import { General_ERROR } from "@/src/types/error_TYPES";
import { SEND_internalError, VIBRATE } from "@/src/utils";
import { useCallback } from "react";
import { z_USE_myVocabs } from "../../zustand/z_USE_myVocabs/z_USE_myVocabs";
import { SOFTDELETE_vocab } from "./SOFTDELETE_vocab/SOFTDELETE_vocab";
import { USE_recollectListLangIds } from "@/src/features_new/lists/hooks/actions/USE_recollectListLangIds/USE_recollectListLangIds";
import USE_refetchAndReplaceMyListInAllLists from "@/src/features_new/lists/hooks/actions/USE_refetchAndReplaceMyListInAllLists/USE_refetchAndReplaceMyListInAllLists";
import USE_refetchStarterContent from "@/src/hooks/zustand/z_USE_myStarterContent/USE_refetchStarterContent/USE_refetchStarterContent";
import { z_USE_myLists } from "@/src/features_new/lists/hooks/zustand/z_USE_myLists/z_USE_myLists";
import { USE_toast } from "@/src/hooks/USE_toast/USE_toast";
import { t } from "i18next";
import { USE_updateListUpdatedAt } from "@/src/features_new/lists/hooks/actions/USE_updateListUpdatedAt/ USE_updateListUpdatedAt";
import { z_USE_user } from "@/src/features_new/user/hooks/z_USE_user/z_USE_user";
import { USE_collectMyVocabsLangIds } from "../../fetchControls/USE_controlMyVocabsFetch/USE_collectMyVocabsLangIds/USE_collectMyVocabsLangIds";

// 🔴🔴🔴 TODO ===> Implement the "await RECOLLECT_langIds" into other functions as well

const function_NAME = "USE_softDeletZevocab";

export function USE_softDeletevocab() {
  const { z_user } = z_USE_user();

  const { IS_inAction, ADD_currentAction, REMOVE_currentAction } =
    z_USE_currentActions();

  const { RECOLLECT_listCollectedLangIds: UPDATE_listDefaultLangIds } =
    USE_recollectListLangIds();

  const { REFETCH_myStarterContent } = USE_refetchStarterContent();
  const {
    z_REMOVE_vocab: z_REMOVE_vocabFromMyVocabsList,
    z_SET_error,

    z_SET_langIds,
    z_fetch_TYPE,
  } = z_USE_myVocabs();
  const { z_REMOVE_listFromMyLists } = z_USE_myLists();
  const { REFECH_andReplaceMyListInLists } =
    USE_refetchAndReplaceMyListInAllLists();
  const { UPDATE_listUpdatedAt = () => {} } = USE_updateListUpdatedAt();
  const { TOAST } = USE_toast();

  const { RECOLLECT_langIds } = USE_collectMyVocabsLangIds({
    z_SET_error,
    z_SET_langIds,
  });

  const _SOFTDELETE_vocab = useCallback(
    async (
      vocab_ID: string,
      list_ID: string,
      SHOULD_updateListUpdatedAt: boolean
    ) => {
      try {
        // --------------------------------------------------
        // Check if item is already in action
        if (IS_inAction("vocab", vocab_ID, "deleting")) return;

        // --------------------------------------------------
        // Insert action
        ADD_currentAction("vocab", vocab_ID, "deleting");

        // --------------------------------------------------
        // Proceed to soft delete
        await SOFTDELETE_vocab(vocab_ID, z_user?.id || "");

        // --------------------------------------------------

        if (SHOULD_updateListUpdatedAt) {
          // Update list
          await UPDATE_listUpdatedAt(list_ID);
        }

        // Update my lists page
        await UPDATE_listDefaultLangIds(list_ID);

        // Update my lists page
        await REFECH_andReplaceMyListInLists(list_ID);

        // Update starter page
        await REFETCH_myStarterContent();

        await RECOLLECT_langIds({
          fetch_TYPE: z_fetch_TYPE,
          targetList_ID: list_ID,
          user_ID: z_user?.id || "",
        });

        // Update UI
        z_REMOVE_vocabFromMyVocabsList(vocab_ID);

        // Provide sensory user feedback
        TOAST("success", t("notification.vocabSoftDeleted"));
        VIBRATE("soft");

        // -----------------------------
      } catch (error: any) {
        const err = new General_ERROR({
          function_NAME: error?.function_NAME || function_NAME,
          message: error?.message,
          errorToSpread: error,
        });

        SEND_internalError(err);
      } finally {
        REMOVE_currentAction(vocab_ID, "deleting");
      }
    },
    []
  );

  return { SOFTDELETE_vocab: _SOFTDELETE_vocab };
}
