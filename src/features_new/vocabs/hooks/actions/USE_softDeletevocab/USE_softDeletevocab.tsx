//
//
//

import { z_USE_currentActions } from "@/src/hooks/zustand/z_USE_currentActions/z_USE_currentActions";
import { General_ERROR } from "@/src/types/error_TYPES";
import { SEND_internalError } from "@/src/utils";
import { useCallback } from "react";
import { USE_zustand } from "@/src/hooks";
import { z_USE_myVocabs } from "../../zustand/z_USE_myVocabs/z_USE_myVocabs";
import { SOFTDELETE_vocab } from "./SOFTDELETE_vocab/SOFTDELETE_vocab";
import { USE_recollectListLangIds } from "@/src/features_new/lists/hooks/actions/USE_recollectListLangIds/USE_recollectListLangIds";

const function_NAME = "USE_softDeletevocab";

export function USE_softDeletevocab() {
  const { z_user } = USE_zustand();

  const { IS_inAction, ADD_currentAction, REMOVE_currentAction } =
    z_USE_currentActions();

  const { UPDATE_listDefaultLangIds } = USE_recollectListLangIds();

  const { z_REMOVE_vocabFromMyVocabsList } = z_USE_myVocabs();

  const _SOFTDELETE_vocab = useCallback(
    async (vocab_ID: string, list_ID: string) => {
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

        z_REMOVE_vocabFromMyVocabsList(vocab_ID);

        await UPDATE_listDefaultLangIds(list_ID);

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
        REMOVE_currentAction(vocab_ID, "deleting");
      }
    },
    []
  );

  return { SOFTDELETE_vocab: _SOFTDELETE_vocab };
}
