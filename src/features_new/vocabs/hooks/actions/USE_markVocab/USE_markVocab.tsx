//
//
//

import { z_USE_currentActions } from "@/src/hooks/zustand/z_USE_currentActions/z_USE_currentActions";
import { General_ERROR } from "@/src/types/error_TYPES";
import { SEND_internalError, VIBRATE } from "@/src/utils";
import { useCallback } from "react";
import { USE_zustand } from "@/src/hooks";
import { z_USE_myVocabs } from "../../zustand/z_USE_myVocabs/z_USE_myVocabs";
import { MARK_vocab } from "./MARK_vocab/MARK_vocab";
import { USE_toast } from "@/src/hooks/USE_toast/USE_toast";
import { t } from "i18next";
import { z_USE_myStarterContent } from "@/src/hooks/zustand/z_USE_myStarterContent/z_USE_myStarterContent";
import USE_refetchStarterContent from "@/src/hooks/zustand/z_USE_myStarterContent/USE_refetchStarterContent/USE_refetchStarterContent";
import USE_refetchAndReplaceMyListInAllLists from "@/src/features_new/lists/hooks/actions/USE_refetchAndReplaceMyListInAllLists/USE_refetchAndReplaceMyListInAllLists";
import { USE_updateListUpdatedAt } from "@/src/features_new/lists/hooks/actions/USE_updateListUpdatedAt/ USE_updateListUpdatedAt";
import { z_USE_user } from "@/src/features_new/user/hooks/z_USE_user/z_USE_user";
import { z_USE_markedVocabs } from "../../zustand/z_USE_markedVocabs/z_USE_markedVocabs";

const function_NAME = "USE_markVocab";

export function USE_markVocab() {
  const { z_user } = z_USE_user();

  const {
    IS_inAction = () => false,
    ADD_currentAction = () => {},
    REMOVE_currentAction = () => {},
  } = z_USE_currentActions();

  const { z_UPDATE_vocab: z_UPDATE_vocabInMyVocabsList = () => {} } =
    z_USE_myVocabs();
  const { z_REPLACE_vocab } = z_USE_markedVocabs();

  const { REFETCH_myStarterContent = () => {} } = USE_refetchStarterContent();
  const { REFECH_andReplaceMyListInLists = () => {} } =
    USE_refetchAndReplaceMyListInAllLists();
  const { TOAST } = USE_toast();
  const { UPDATE_listUpdatedAt = () => {} } = USE_updateListUpdatedAt();

  const _MARK_vocab = useCallback(
    async (
      vocab_ID: string,
      list_ID: string,
      IS_marked: boolean,
      SHOULD_updateListUpdatedAt: boolean
    ) => {
      try {
        // --------------------------------------------------
        // Check if item is already in action
        if (IS_inAction("vocab", vocab_ID, "updating_marked")) return;

        // --------------------------------------------------
        // Insert action
        ADD_currentAction("vocab", vocab_ID, "updating_marked");

        // --------------------------------------------------
        // Proceed to mark vocab
        const { updated_VOCAB } = await MARK_vocab(
          vocab_ID,
          z_user?.id || "",
          IS_marked
        );

        if (!updated_VOCAB)
          throw new General_ERROR({
            function_NAME,
            message:
              "'MARK_vocab' returned undefined 'updated_VOCAB', although no error was thrown",
          });

        // --------------------------------------------------
        if (SHOULD_updateListUpdatedAt) {
          // Update list
          await UPDATE_listUpdatedAt(list_ID);
        }

        // Update my lists page
        await REFECH_andReplaceMyListInLists(list_ID);

        // Update starter page
        await REFETCH_myStarterContent();

        // Update UI
        z_UPDATE_vocabInMyVocabsList(updated_VOCAB);
        z_REPLACE_vocab(updated_VOCAB);

        // Provide sensory user feedback
        const toast_MSG = IS_marked
          ? t("notification.vocabMarked")
          : t("notification.vocabUnmarked");
        TOAST("success", toast_MSG);
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
        REMOVE_currentAction(vocab_ID, "updating_marked");
      }
    },
    []
  );

  return { MARK_vocab: _MARK_vocab };
}
