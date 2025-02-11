//
//
//

import { Vocab_MODEL } from "@/src/features/vocabs/types";
import { USE_zustand, USE_abortController } from "@/src/hooks";
import { loadingState_TYPES } from "@/src/types";
import { useCallback } from "react";

import { Error_PROPS } from "@/src/props";
import { vocabFetch_TYPES, vocabList_TYPES } from "./FETCH_vocabs/types";
import { myVocabs_REDUCER_RESPONSE_TYPE } from "../USE_myVocabsReducer/Vocab_REDUCER/types";
import { FETCH_vocabs } from "./FETCH_vocabs/FETCH_vocabs";
import { TRANSFORM_error } from "@/src/utils/TRANSFORM_error/TRANSFORM_error";

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
  const { START_newRequest } = USE_abortController();

  const FETCH = useCallback(
    async (loadingState_TYPE: loadingState_TYPES) => {
      // Create new fetch request, so that we could cancel it in case
      // a new request was sent, and this one hasn't finished fetching
      const newController = START_newRequest();

      // When fetching additional vocabs that we will add to the pagination,
      // lets exclude the vocab ids that have already been printed
      const excludeIds: Set<string> =
        loadingState_TYPE === "loading_more"
          ? reducer_STATE?.data?.printed_IDS || new Set()
          : new Set();

      try {
        SET_reducerLoadingState(loadingState_TYPE);
        SET_reducerError(undefined);

        const { data, error } = await FETCH_vocabs({
          search,
          signal: newController.signal,
          // amount: VOCAB_PAGINATION || 20,
          amount: 2,
          user_id: z_user?.id || "",
          fetch_TYPE,
          list_TYPE,
          excludeIds,
          targetList_ID,
          difficultyFilters: z_vocabDisplay_SETTINGS?.difficultyFilters,
          langFilters: z_vocabDisplay_SETTINGS?.langFilters,
          sortDirection: z_vocabDisplay_SETTINGS?.sortDirection,
          sorting: z_vocabDisplay_SETTINGS?.sorting,
        });

        if (newController.signal.aborted) {
          // Do not update the reducer state if signal has been aborted (if fetch has been canceled).
          // Also, don't throw any errors, because the only reason this will abort is if a new fetch request has started.
          return;
        }

        if (error || !data) throw error || new Error("Failed to fetch vocabs.");
        if (data) APPEND_vocabsToPagination(data);
        SET_reducerLoadingState("none");

        // --------------------------------------------------
      } catch (error: any) {
        const _function_NAME = error?.function_NAME
          ? error.function_NAME
          : function_NAME;
        const _err = TRANSFORM_error(_function_NAME, error);
        SET_reducerError(_err);
        SET_reducerLoadingState("error");
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
