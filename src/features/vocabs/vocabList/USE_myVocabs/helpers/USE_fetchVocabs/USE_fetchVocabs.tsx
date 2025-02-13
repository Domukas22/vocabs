//
//
//

import { USE_zustand, USE_abortController } from "@/src/hooks";
import { loadingState_TYPES } from "@/src/types/general_TYPES";
import { useCallback } from "react";

import { General_ERROR } from "@/src/types/error_TYPES";
import {
  FETCH_myVocabs_RESPONSE_TYPE,
  vocabFetch_TYPES,
  vocabList_TYPES,
} from "./helpers/FETCH_vocabs/types";
import { vocabsReducer_TYPE } from "../USE_myVocabsReducer/Vocab_REDUCER/types";
import { FETCH_vocabs, GET_AlreadyPrintedVocabIds } from "./helpers";

const function_NAME = "USE_fetchVocabs";

export function USE_fetchVocabs({
  search = "",
  targetList_ID = "",
  reducer,
  fetch_TYPE,
  list_TYPE,
}: {
  search: string;
  targetList_ID?: string | undefined;
  reducer: vocabsReducer_TYPE;
  fetch_TYPE: vocabFetch_TYPES;
  list_TYPE: vocabList_TYPES;
}) {
  const { z_user, z_vocabDisplay_SETTINGS } = USE_zustand();
  const { difficultyFilters, langFilters, sortDirection, sorting } =
    z_vocabDisplay_SETTINGS;

  const { START_newRequest } = USE_abortController();

  const FETCH = useCallback(
    async (
      loadingState_TYPE: loadingState_TYPES
    ): Promise<FETCH_myVocabs_RESPONSE_TYPE | undefined> => {
      // Create new fetch request, so that we could cancel it in case
      // a new request was sent, and this one hasn't finished fetching
      const newController = START_newRequest();
      const { alreadyPrintedVocab_IDs } = GET_AlreadyPrintedVocabIds(
        loadingState_TYPE,
        reducer
      );

      try {
        const data = await FETCH_vocabs({
          search,
          signal: newController.signal,
          // amount: VOCAB_PAGINATION || 20,
          amount: 2,
          user_id: z_user?.id || "",
          fetch_TYPE,
          list_TYPE,
          excludeIds: alreadyPrintedVocab_IDs,
          targetList_ID,
          difficultyFilters,
          langFilters,
          sortDirection,
          sorting,
        });

        // Do not update the reducer state if signal has been aborted (if fetch has been canceled).
        // Also, don't throw any errors, because the only reason this will abort is if a new fetch request has started.
        if (newController.signal.aborted) return;

        if (
          !data ||
          typeof data?.unpaginated_COUNT !== "number" ||
          !data?.vocabs
        ) {
          throw new General_ERROR({
            function_NAME,
            message:
              "FETCH_vocabs returned an undefined 'data' object, although it didn't throw an error",
          });
        }

        return data;
        // --------------------------------------------------
      } catch (error: any) {
        throw new General_ERROR({
          function_NAME: error?.function_NAME || function_NAME,
          message: error?.message,
          errorToSpread: error,
        });
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
      reducer.data?.printed_IDS,
    ]
  );

  return { FETCH };
}
