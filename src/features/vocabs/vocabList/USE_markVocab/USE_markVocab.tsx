//
//
//

import { currentVocabAction_TYPE } from "@/src/app/(main)/vocabs/[list_id]";
import { USE_toast } from "@/src/hooks/USE_toast/USE_toast";
import { General_ERROR } from "@/src/types/error_TYPES";
import { Delay, SEND_internalError } from "@/src/utils";
import { useCallback } from "react";
import { IS_vocabMarkedBeingUpdated } from "./helpers";
import { UPDATE_vocabMarked } from "./helpers/UPDATE_vocabMarked/UPDATE_vocabMarked";
import { Vocab_TYPE } from "../../types";

const function_NAME = "USE_markVocab";

export function USE_markVocab({
  currentVocab_ACTIONS = [],
  START_vocabAction = () => {},
  STOP_vocabAction = () => {},
  onSuccess = () => {},
}: {
  currentVocab_ACTIONS: currentVocabAction_TYPE[];
  START_vocabAction: (new_ACTION: currentVocabAction_TYPE) => void;
  STOP_vocabAction: (vocab_ID: string) => void;
  onSuccess: (vocab: Vocab_TYPE) => void;
}) {
  const { TOAST } = USE_toast();

  const MARK_vocab = useCallback(async (vocab_ID: string, val: boolean) => {
    try {
      // If the marked value is already being updated, don't update again
      if (IS_vocabMarkedBeingUpdated(vocab_ID, currentVocab_ACTIONS)) return;
      START_vocabAction({ action: "updating_marked", vocab_ID: vocab_ID });

      const { data, error } = await UPDATE_vocabMarked(vocab_ID, val);

      if (error) throw error;

      if (!data)
        throw new General_ERROR({
          function_NAME,
          message:
            "'UPDATE_vocabMarked' returned undefined data, although no error was thrown",
        });

      onSuccess(data);
      TOAST("success", val ? "Vocab marked" : "Vocab unmarked");
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

  return { MARK_vocab };
}
