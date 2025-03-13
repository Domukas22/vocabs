//
//
//

//
//
//

import { useCallback } from "react";

import { General_ERROR } from "@/src/types/error_TYPES";
import { vocabFetch_TYPES } from "../../../../functions/FETCH_vocabs/types";

import { z_INSERT_myVocabsError_TYPE } from "../../../zustand/z_USE_myVocabs/z_USE_myVocabs";
import DETERMINE_loadingState from "@/src/utils/DETERMINE_loadingState/DETERMINE_loadingState";
import { SEND_internalError } from "@/src/utils";
import { COLLECT_myVocabLangIds } from "@/src/features_new/vocabs/functions/COLLECT_myVocabLangIds/COLLECT_myVocabLangIds";

type props = {
  user_ID: string;
  fetch_TYPE: vocabFetch_TYPES;
  targetList_ID: string;
};

const function_NAME = "USE_collectMyVocabsLangIds";

export function USE_collectMyVocabsLangIds({
  z_SET_langIds = () => {},
  z_SET_error = () => {},
}: {
  z_SET_langIds: (lang_ids: string[]) => void;
  z_SET_error: z_INSERT_myVocabsError_TYPE;
}) {
  const RECOLLECT_langIds = useCallback(
    async (args: props): Promise<void> => {
      try {
        const { lang_IDs } = await COLLECT_myVocabLangIds(args);

        if (!lang_IDs)
          throw new General_ERROR({
            function_NAME,
            message:
              "'COLLECT_myVocabLangIds' returned an undefined 'lang_IDs' array, although it didn't throw an error",
          });

        z_SET_langIds(lang_IDs);

        // --------------------------------------------------
      } catch (error: any) {
        if (error.message === "AbortError: Aborted") return;
        const err = new General_ERROR({
          function_NAME: error?.function_NAME || function_NAME,
          message: error?.message,
          errorToSpread: error,
        });

        z_SET_error(err);
        SEND_internalError(err);
      }
    },
    [DETERMINE_loadingState, z_SET_error]
  );

  return { RECOLLECT_langIds };
}
