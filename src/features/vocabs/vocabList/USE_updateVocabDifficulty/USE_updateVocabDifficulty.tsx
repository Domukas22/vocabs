//
//
//

import { currentVocabAction_TYPE } from "@/src/app/(main)/vocabs/[list_id]";
import { USE_toast } from "@/src/hooks/USE_toast/USE_toast";
import { General_ERROR } from "@/src/types/error_TYPES";
import { Delay, SEND_internalError } from "@/src/utils";
import { useCallback, useState } from "react";
import {
  IS_vocabDifficultyBeingUpdated,
  UPDATE_vocabDifficulty,
} from "./helpers";

import { raw_Vocab_TYPE } from "../../types";
import { useTranslation } from "react-i18next";
import { USE_abortController } from "@/src/hooks";

const function_NAME = "USE_updateVocabDifficulty";

export function USE_updateVocabDifficultysasd({
  z_myVocabsCurrent_ACTIONS = [],
  START_vocabAction = () => {},
  STOP_vocabAction = () => {},
  onSuccess = () => {},
}: {
  z_myVocabsCurrent_ACTIONS: currentVocabAction_TYPE[];
  START_vocabAction: (new_ACTION: currentVocabAction_TYPE) => void;
  STOP_vocabAction: (vocab_ID: string) => void;
  onSuccess: (vocab: raw_Vocab_TYPE) => void;
}) {
  const { TOAST } = USE_toast();
  const { t } = useTranslation();

  const UPDATE_difficulty = useCallback(
    async (
      vocab_ID: string,
      current_DIFFICULTY: number,
      new_DIFFICULTY: 1 | 2 | 3,
      CLOSE_editBtns: () => void = () => {}
    ) => {
      try {
        // If the marked value is already being updated, don't update again
        if (IS_vocabDifficultyBeingUpdated(vocab_ID, z_myVocabsCurrent_ACTIONS))
          return;

        if (current_DIFFICULTY === new_DIFFICULTY) return;

        START_vocabAction({
          action: "updating_difficulty",
          vocab_ID: vocab_ID,
          new_DIFFICULTY,
        });

        const { data, error } = await UPDATE_vocabDifficulty(
          vocab_ID,
          new_DIFFICULTY
        );

        if (error) throw error;

        if (!data)
          throw new General_ERROR({
            function_NAME,
            message:
              "'UPDATE_vocabDifficulty' returned undefined data, although no error was thrown",
          });

        STOP_vocabAction(vocab_ID);
        onSuccess(data);
        CLOSE_editBtns();
        TOAST("success", t("success.updatedVocabDifficulty"));
      } catch (error: any) {
        const err = new General_ERROR({
          message: error?.message,
          function_NAME,
          errorToSpread: error,
        });

        STOP_vocabAction(vocab_ID);
        TOAST("error", err.user_MSG);
        await SEND_internalError(err);
      }
    },
    [z_myVocabsCurrent_ACTIONS]
  );

  return { UPDATE_difficulty };
}
