//
//
//

import { Vocab_MODEL } from "@/src/features/vocabs/types";
import { USE_zustand, USE_abortController } from "@/src/hooks";
import { loadingState_TYPES } from "@/src/types";
import { useCallback } from "react";

import { Error_PROPS } from "@/src/props";
import {
  vocabFetch_TYPES,
  vocabList_TYPES,
} from "./helpers/FETCH_vocabs/types";
import { myVocabs_REDUCER_RESPONSE_TYPE } from "../USE_myVocabsReducer/Vocab_REDUCER/types";
import { TRANSFORM_error } from "@/src/utils/TRANSFORM_error/TRANSFORM_error";
import { FETCH_vocabs, GET_AlreadyPrintedVocabIds } from "./helpers";

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
  SET_reducerLoadingState: (loadingState_TYPE: loadingState_TYPES) => void;
}) {
  const { z_user, z_vocabDisplay_SETTINGS } = USE_zustand();
  const { START_newRequest } = USE_abortController();

  const FETCH = useCallback(
    async (loadingState_TYPE: loadingState_TYPES) => {
      // Create new fetch request, so that we could cancel it in case
      // a new request was sent, and this one hasn't finished fetching
      const newController = START_newRequest();
      const { alreadyPrintedVocab_IDs } = GET_AlreadyPrintedVocabIds(
        loadingState_TYPE,
        reducer_STATE
      );

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
          excludeIds: alreadyPrintedVocab_IDs,
          targetList_ID,
          difficultyFilters: z_vocabDisplay_SETTINGS?.difficultyFilters,
          langFilters: z_vocabDisplay_SETTINGS?.langFilters,
          sortDirection: z_vocabDisplay_SETTINGS?.sortDirection,
          sorting: z_vocabDisplay_SETTINGS?.sorting,
        });

        // Do not update the reducer state if signal has been aborted (if fetch has been canceled).
        // Also, don't throw any errors, because the only reason this will abort is if a new fetch request has started.
        if (newController.signal.aborted) return;

        if (error || !data) {
          throw (
            error || {
              message: "FETCH_vocabs returned no error, but data was undefined",
            }
          );
        }

        APPEND_vocabsToPagination(data);
        SET_reducerLoadingState("none");

        // --------------------------------------------------
      } catch (error: any) {
        SET_reducerError(
          TRANSFORM_error(error.function_NAME || function_NAME, error)
        );
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
