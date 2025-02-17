//
//
//

import { USE_toast } from "@/src/hooks/USE_toast/USE_toast";
import { General_ERROR } from "@/src/types/error_TYPES";
import { SEND_internalError } from "@/src/utils";
import { useCallback } from "react";

import { SOFTDELETE_vocab, IS_vocabMarkedBeingDeleted } from "./helpers";
import { currentVocabAction_TYPE } from "@/src/hooks/z_USE_oneList/z_USE_oneList";

const function_NAME = "USE_deleteVocab";

export function USE_softDeleteVocab({
  currentVocab_ACTIONS = [],
  START_vocabAction = () => {},
  STOP_vocabAction = () => {},
  onSuccess = () => {},
}: {
  currentVocab_ACTIONS: currentVocabAction_TYPE[];
  START_vocabAction: (new_ACTION: currentVocabAction_TYPE) => void;
  STOP_vocabAction: (vocab_ID: string) => void;
  onSuccess: (vocab_ID: string) => void;
}) {
  const { TOAST } = USE_toast();

  const _DELETE_vocab = useCallback(async (vocab_ID: string) => {
    try {
      // If the marked value is already being updated, don't update again
      if (IS_vocabMarkedBeingDeleted(vocab_ID, currentVocab_ACTIONS)) return;
      START_vocabAction({ action: "deleting", vocab_ID: vocab_ID });

      const { success, error } = await SOFTDELETE_vocab(vocab_ID);

      if (error) throw error;

      if (!success)
        throw new General_ERROR({
          function_NAME,
          message:
            "'DELETE_vocab' returned undefined data, although no error was thrown",
        });

      onSuccess(vocab_ID);
      TOAST("success", "Vocab deleted");
    } catch (error: any) {
      const err = new General_ERROR({
        message: error?.message,
        function_NAME,
        errorToSpread: error,
      });

      TOAST("error", err.user_MSG);
      await SEND_internalError(err);
    } finally {
      STOP_vocabAction(vocab_ID);
    }
  }, []);

  return { SOFTDELETE_vocab: _DELETE_vocab };
}
