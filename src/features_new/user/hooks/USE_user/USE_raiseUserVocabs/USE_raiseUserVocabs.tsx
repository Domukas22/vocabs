//
//
//

import { USE_error } from "@/src/hooks";
import { General_ERROR } from "@/src/types/error_TYPES";
import { useCallback, useState } from "react";
import { z_USE_user } from "../../z_USE_user/z_USE_user";
import { FETCH_currentUserMaxVocabCount } from "./FETCH_currentUserMaxVocabCount/FETCH_currentUserMaxVocabCount";
import { RAISE_userVocabs } from "./RAISE_userVocabs/RAISE_userVocabs";
import { SEND_internalError } from "@/src/utils";

const function_NAME = "USE_raiseUserVocabs";

export function USE_raiseUserVocabs() {
  const { z_user, z_SET_userMaxVocabCount } = z_USE_user();
  const { error, SET_error, RESET_error } = USE_error<
    General_ERROR | undefined
  >();
  const [loading, SET_loading] = useState(false);

  const _RAISE_vocabs = useCallback(
    async (toAddVocab_COUNT: number, onSuccess: () => void = () => {}) => {
      if (loading) return;
      SET_error(undefined);
      SET_loading(true);

      try {
        const { maxVocab_COUNT } = await FETCH_currentUserMaxVocabCount(
          z_user?.id || ""
        );

        const { newMaxVocab_COUNT } = await RAISE_userVocabs({
          user_id: z_user?.id || "",
          currentMaxVocab_COUNT: maxVocab_COUNT,
          toAddVocab_COUNT: toAddVocab_COUNT,
        });

        z_SET_userMaxVocabCount(newMaxVocab_COUNT);
        onSuccess();
      } catch (error: any) {
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
    [z_user]
  );

  return { RAISE_vocabs: _RAISE_vocabs, loading, error, RESET_error };
}
