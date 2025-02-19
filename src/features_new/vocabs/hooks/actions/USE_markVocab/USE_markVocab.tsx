//
//
//

import { z_USE_currentActions } from "@/src/hooks/zustand/z_USE_currentActions/z_USE_currentActions";
import { General_ERROR } from "@/src/types/error_TYPES";
import { SEND_internalError } from "@/src/utils";
import { useCallback } from "react";
import { USE_zustand } from "@/src/hooks";
import { z_USE_myVocabs } from "../../zustand/z_USE_myVocabs/z_USE_myVocabs";
import { MARK_vocab } from "./MARK_vocab/MARK_vocab";

const function_NAME = "USE_markVocab";

export function USE_markVocab() {
  const { z_user } = USE_zustand();

  const { IS_inAction, ADD_currentAction, REMOVE_currentAction } =
    z_USE_currentActions();

  const { z_UPDATE_vocabInMyVocabsList } = z_USE_myVocabs();

  const _MARK_vocab = useCallback(
    async (vocab_ID: string, list_ID: string, IS_marked: boolean) => {
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

        z_UPDATE_vocabInMyVocabsList(updated_VOCAB);

        // refetch item inside all lists page
        // refetch item inside one list state
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
        REMOVE_currentAction(vocab_ID, "updating_marked");
      }
    },
    []
  );

  return { MARK_vocab: _MARK_vocab };
}
