//
//
//

import {
  CREATE_internalErrorMsg,
  VOCAB_PAGINATION,
} from "@/src/constants/globalVars";
import { Vocab_MODEL } from "@/src/features/vocabs/types";
import { USE_zustand, USE_abortController } from "@/src/hooks";
import { loadingState_TYPES } from "@/src/types";
import { useCallback, useRef } from "react";

import { Error_PROPS } from "@/src/props";
import {
  vocabFetch_TYPES,
  vocabList_TYPES,
} from "./helpers/FETCH_vocabs/types";
import { myVocabs_REDUCER_RESPONSE_TYPE } from "../USE_myVocabsReducer/helpers/Vocab_REDUCER/types";
import { FETCH_vocabs } from "./helpers/FETCH_vocabs/FETCH_vocabs";
import { TRANSFORM_errorInCatchBlock } from "@/src/utils/TRANSFORM_errorInCatchBlock/TRANSFORM_errorInCatchBlock";

const function_NAME = "USE_fetchVocabsHelper";

export function USE_fetchVocabsHelper({
  search,
  targetList_ID,
  reducer_STATE,
  APPEND_vocabsToPagination,
  SET_reducerLoadingState,
  SET_reducerError,
  fetch_TYPE,
  list_TYPE,
}: {
  search: string;
  targetList_ID?: string | undefined;
  reducer_STATE: myVocabs_REDUCER_RESPONSE_TYPE;
  fetch_TYPE: vocabFetch_TYPES;
  list_TYPE: vocabList_TYPES;
  APPEND_vocabsToPagination: (data: {
    vocabs: Vocab_MODEL[];
    unpaginated_COUNT: number;
  }) => void;
  SET_reducerError: (err?: Error_PROPS) => void;
  SET_reducerLoadingState: (fetch_TYPE: loadingState_TYPES) => void;
}) {
  const { z_user, z_vocabDisplay_SETTINGS } = USE_zustand();
  const abortControllerRef = useRef<AbortController | null>(null);

  const FETCH = useCallback(
    async (loadingState_TYPE: loadingState_TYPES) => {
      // Abort the previous fetch if it's still ongoing
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Create a new AbortController for this request
      const abortController = new AbortController();
      abortControllerRef.current = abortController;

      try {
        SET_reducerLoadingState(loadingState_TYPE);
        SET_reducerError(undefined);

        const { data, error } = await FETCH_vocabs({
          search,
          signal: abortControllerRef?.current?.signal,
          // amount: VOCAB_PAGINATION || 20,
          amount: 2,
          user_id: z_user?.id || "",
          fetch_TYPE,
          list_TYPE,
          excludeIds:
            loadingState_TYPE === "loading_more"
              ? reducer_STATE?.data?.printed_IDS || new Set()
              : new Set(),
          targetList_ID,
          z_vocabDisplay_SETTINGS,
        });

        if (abortController.signal.aborted) {
          // Prevent updates if the request was aborted
          return;
        }

        if (error || !data) {
          throw error || new Error("Failed to fetch vocabs.");
        }

        if (data) {
          APPEND_vocabsToPagination(data);
        }
        SET_reducerLoadingState("none");
      } catch (error: any) {
        if (!abortController.signal.aborted) {
          const _err = TRANSFORM_errorInCatchBlock({
            error,
            function_NAME: error?.function_NAME
              ? error.function_NAME
              : function_NAME,
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
