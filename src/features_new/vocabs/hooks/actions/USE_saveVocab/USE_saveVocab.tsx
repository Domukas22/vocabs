//
//
//

import { FormInput_ERROR, General_ERROR } from "@/src/types/error_TYPES";
import { SEND_internalError } from "@/src/utils";
import { useCallback, useState } from "react";
import { t } from "i18next";
import { z_USE_user } from "@/src/features_new/user/hooks/z_USE_user/z_USE_user";
import { SAVE_vocab } from "./SAVE_vocab/SAVE_vocab";
import { USE_celebrate, USE_error } from "@/src/hooks";
import { Vocab_EVENTS } from "@/src/mitt/mitt";
import { Vocab_TYPE } from "../../../types";
import { CAN_userCreateThisAmountOfVocabs } from "../../../functions/CAN_userCreateThisAmountOfVocabs/CAN_userCreateThisAmountOfVocabs";

const function_NAME = "USE_saveVocab";

export function USE_saveVocab() {
  const { z_user } = z_USE_user();
  const { celebrate } = USE_celebrate();

  const { error, SET_error, RESET_error } = USE_error<
    General_ERROR | FormInput_ERROR | undefined
  >();
  const [loading, SET_loading] = useState(false);

  const _SAVE_vocab = useCallback(
    async (vocab: Vocab_TYPE, list_id: string, onSuccess: () => void) => {
      try {
        if (loading) return;
        SET_error(undefined);
        SET_loading(true);

        // ----------------------------------------
        // Can the user create one more vocab?
        const { allow, max_vocabs } = await CAN_userCreateThisAmountOfVocabs(
          z_user?.id || "",
          1
        );

        if (!allow)
          throw new FormInput_ERROR({
            user_MSG: `You have reached your vocabulary limit of ${max_vocabs}. Go to the "General" tab to get more vocabs.`,
            falsyForm_INPUTS: [{ input_NAME: "list", message: "..." }],
          });

        // --------------------------------------------------
        // Proceed to create vocab
        const { saved_VOCAB } = await SAVE_vocab({
          vocab,
          list_id,
          user_id: z_user?.id,
        });

        // --------------------------------------------------

        Vocab_EVENTS.emit("copied", {
          vocabs: [saved_VOCAB],
          targetList_ID: saved_VOCAB.list_id,
        });

        onSuccess();
        celebrate(t("notification.oneVocabSaved"));
        // -----------------------------
      } catch (error: any) {
        // HANDLE_formInputError(error);
        if (Object.hasOwn(error, "falsyForm_INPUTS")) {
          SET_error(error);
          return;
        }

        const err = new General_ERROR({
          function_NAME: error?.function_NAME || function_NAME,
          message: error?.message,
          errorToSpread: error,
        });

        SET_error(err);
        SEND_internalError(err);
      } finally {
        SET_loading(false);
      }
    },
    [loading, z_user?.id, celebrate, SET_error, SET_loading]
  );

  return {
    SAVE_vocab: _SAVE_vocab,
    loading,
    error,
    RESET_error,
  };
}
