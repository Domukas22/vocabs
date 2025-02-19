//
//
//

import { z_USE_currentActions } from "@/src/hooks/zustand/z_USE_currentActions/z_USE_currentActions";
import { General_ERROR } from "@/src/types/error_TYPES";
import { SEND_internalError } from "@/src/utils";
import { useCallback } from "react";
import { USE_zustand } from "@/src/hooks";
import { UPDATE_vocabDifficulty } from "./UPDATE_vocabDifficulty/UPDATE_vocabDifficulty";
import { USE_updateListUpdatedAt } from "@/src/features_new/lists/hooks/actions/USE_updateListUpdatedAt/ USE_updateListUpdatedAt";
import { z_USE_myVocabs } from "../../zustand/z_USE_myVocabs/z_USE_myVocabs";

const function_NAME = "USE_updateVocabDifficulty";

export function USE_updateVocabDifficulty() {
  const { z_user } = USE_zustand();

  const { IS_inAction, ADD_currentAction, REMOVE_currentAction } =
    z_USE_currentActions();

  const { UPDATE_listUpdatedAt } = USE_updateListUpdatedAt();
  const { z_UPDATE_vocabInMyVocabsList } = z_USE_myVocabs();

  const _UPDATE_vocabDifficulty = useCallback(
    async (
      vocab_ID: string,
      current_DIFFICULTY: number,
      new_DIFFICULTY: 1 | 2 | 3
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

        z_UPDATE_vocabInMyVocabsList(updated_VOCAB);

        await UPDATE_listUpdatedAt(updated_VOCAB.list_id);

        // z_SET_myOneList(updated_LIST);
        // z_UPDATE_listInMyLists(updated_LIST);
        // refetch starter page state

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
