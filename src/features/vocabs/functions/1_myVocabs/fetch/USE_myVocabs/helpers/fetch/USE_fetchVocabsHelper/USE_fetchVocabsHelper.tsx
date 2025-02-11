//
//
//

import {
  CREATE_internalErrorMsg,
  VOCAB_PAGINATION,
} from "@/src/constants/globalVars";
import Vocab_MODEL from "@/src/db/models/Vocab_MODEL";
import { USE_zustand, USE_abortController } from "@/src/hooks";
import { loadingState_TYPES } from "@/src/types";
import { useCallback } from "react";
import { FETCH_myVocabs } from "../../../../FETCH_myVocabs/FETCH_myVocabs";
import { USE_vocabs_FETCH_TYPES } from "../../../../FETCH_myVocabs/types";
import { myVocabs_REDUCER_RESPONSE_TYPE } from "../../reducer/myVocabs_REDUCER/types";
import { Error_PROPS } from "@/src/props";
import { HANDLE_userErrorInsideFinalCatchBlock } from "@/src/utils";

const function_NAME = "USE_fetchVocabsHelper";

export default function USE_fetchVocabsHelper({
  type,
  search,
  targetList_ID,
  reducer_STATE,
  APPEND_vocabsToPagination,
  SET_reducerLoadingState,
  SET_reducerError,
}: {
  type: USE_vocabs_FETCH_TYPES;
  search: string;
  targetList_ID?: string | undefined;
  reducer_STATE: myVocabs_REDUCER_RESPONSE_TYPE;
  APPEND_vocabsToPagination: (data: {
    vocabs: Vocab_MODEL[];
    unpaginated_COUNT: number;
  }) => void;
  SET_reducerError: (err?: Error_PROPS) => void;
  SET_reducerLoadingState: (fetch_TYPE: loadingState_TYPES) => void;
}) {
  const { z_user, z_vocabDisplay_SETTINGS } = USE_zustand();
  const { startNewRequest } = USE_abortController();

  const FETCH = useCallback(
    async (fetch_TYPE: loadingState_TYPES) => {
      const abortController = startNewRequest();
      try {
        SET_reducerLoadingState(fetch_TYPE);
        SET_reducerError(undefined);

        const { data, error } = await FETCH_myVocabs({
          type,
          search,
          amount: VOCAB_PAGINATION || 20,
          user_id: z_user?.id || "",
          excludeIds:
            fetch_TYPE === "loading_more"
              ? reducer_STATE.data?.printed_IDS
              : new Set(),
          targetList_ID,
          z_vocabDisplay_SETTINGS,
        });

        if (abortController.signal.aborted) return null;

        if (error || !data) {
          throw error || new Error("Failed to fetch vocabs.");
        }

        if (data) {
          APPEND_vocabsToPagination(data);
        }
        SET_reducerLoadingState("none");
      } catch (error: any) {
        if (!abortController.signal.aborted) {
          const _err = HANDLE_userErrorInsideFinalCatchBlock({
            error,
            function_NAME: error?.function_NAME
              ? error.function_NAME
              : function_NAME,
            internalErrorUser_MSG: error?.internal_MSG
              ? error.internal_MSG
              : CREATE_internalErrorMsg("trying to fetch your vocabs"),
          });
          SET_reducerError(_err);
          SET_reducerLoadingState("error");
        }
      }
    },
    [
      search,
      z_vocabDisplay_SETTINGS.difficultyFilters,
      z_vocabDisplay_SETTINGS.langFilters,
      z_vocabDisplay_SETTINGS.sortDirection,
      z_vocabDisplay_SETTINGS.sorting,
      z_user?.id,
      targetList_ID,
      reducer_STATE.data?.printed_IDS,
    ]
  );

  return { FETCH };
}
