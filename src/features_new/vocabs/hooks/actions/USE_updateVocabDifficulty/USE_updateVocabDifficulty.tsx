//
//
//

import { z_USE_currentActions } from "@/src/hooks/zustand/z_USE_currentActions/z_USE_currentActions";
import { General_ERROR } from "@/src/types/error_TYPES";
import { SEND_internalError, VIBRATE } from "@/src/utils";
import { useCallback } from "react";
import { USE_zustand } from "@/src/hooks";
import { UPDATE_vocabDifficulty } from "./UPDATE_vocabDifficulty/UPDATE_vocabDifficulty";
import { USE_updateListUpdatedAt } from "@/src/features_new/lists/hooks/actions/USE_updateListUpdatedAt/ USE_updateListUpdatedAt";
import { z_USE_myVocabs } from "../../zustand/z_USE_myVocabs/z_USE_myVocabs";
import USE_refetchAndReplaceMyListInAllLists from "@/src/features_new/lists/hooks/actions/USE_refetchAndReplaceMyListInAllLists/USE_refetchAndReplaceMyListInAllLists";
import USE_refetchStarterContent from "@/src/hooks/zustand/z_USE_myStarterContent/USE_refetchStarterContent/USE_refetchStarterContent";
import { USE_toast } from "@/src/hooks/USE_toast/USE_toast";
import { t } from "i18next";
import { z_USE_user } from "@/src/features_new/user/hooks/z_USE_user/z_USE_user";

const function_NAME = "USE_updateVocabDifficulty";

export function USE_updateVocabDifficulty() {
  const { z_user } = z_USE_user();

  const {
    IS_inAction = () => false,
    ADD_currentAction = () => {},
    REMOVE_currentAction = () => {},
  } = z_USE_currentActions();

  const { UPDATE_listUpdatedAt = () => {} } = USE_updateListUpdatedAt();
  const { z_UPDATE_vocabInMyVocabsList = () => {} } = z_USE_myVocabs();

  const { REFECH_andReplaceMyListInLists = () => {} } =
    USE_refetchAndReplaceMyListInAllLists();

  const { REFETCH_myStarterContent = () => {} } = USE_refetchStarterContent();

  const { TOAST } = USE_toast();

  const _UPDATE_vocabDifficulty = useCallback(
    async (
      vocab_ID: string,
      current_DIFFICULTY: number,
      new_DIFFICULTY: 1 | 2 | 3,
      SHOULD_updateListUpdatedAt: boolean
    ) => {
      try {
        // No need to update same difficulty
        if (current_DIFFICULTY === new_DIFFICULTY) return;

        // --------------------------------------------------
        // Check if item is already in action
        if (IS_inAction("vocab", vocab_ID, "updating_difficulty")) return;

        // --------------------------------------------------
        // Insert action
        ADD_currentAction("vocab", vocab_ID, "updating_difficulty");

        // --------------------------------------------------
        // Proceed to update
        const { updated_VOCAB } = await UPDATE_vocabDifficulty(
          vocab_ID,
          z_user?.id || "",
          new_DIFFICULTY
        );

        if (!updated_VOCAB)
          throw new General_ERROR({
            function_NAME,
            message:
              "'UPDATE_vocabDifficulty' returned undefined 'updated_VOCAB', although no error was thrown",
          });

        // --------------------------------------------------

        if (SHOULD_updateListUpdatedAt) {
          // Update list
          await UPDATE_listUpdatedAt(updated_VOCAB.list_id);
        }

        // Update my lists page
        await REFECH_andReplaceMyListInLists(updated_VOCAB.list_id);

        // Update starter page
        await REFETCH_myStarterContent();

        // Update UI
        z_UPDATE_vocabInMyVocabsList(updated_VOCAB);

        // Provide sensory user feedback
        TOAST("success", t("notification.vocabDifficultyUpdated"));
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
        REMOVE_currentAction(vocab_ID, "updating_difficulty");
      }
    },
    []
  );

  return { UPDATE_vocabDifficulty: _UPDATE_vocabDifficulty };
}
