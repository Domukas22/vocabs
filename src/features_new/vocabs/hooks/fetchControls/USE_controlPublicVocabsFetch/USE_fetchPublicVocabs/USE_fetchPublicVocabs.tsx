//
//
//

import { USE_abortController } from "@/src/hooks";
import { loadingState_TYPES } from "@/src/types/general_TYPES";
import { useCallback } from "react";

import { General_ERROR } from "@/src/types/error_TYPES";

import { VOCAB_PAGINATION } from "@/src/constants/globalVars";
import { FETCH_vocabs } from "../../../../functions/FETCH_vocabs/FETCH_vocabs";
import {
  z_INSERT_fetchedVocabs_TYPE,
  z_INSERT_publicVocabsError_TYPE,
  z_PREPARE_publicVocabsForFetch_TYPE,
} from "../../../zustand/z_USE_publicVocabs/z_USE_publicVocabs";
import DETERMINE_loadingState from "@/src/utils/DETERMINE_loadingState/DETERMINE_loadingState";
import { SEND_internalError } from "@/src/utils";
import { vocabFetch_TYPES } from "../../../../functions/FETCH_vocabs/types";

interface USE_fetchPublicVocabs_PROPS {
  search: string;
  loadMore: boolean;
  excludeIds: Set<string>;
  fetch_TYPE: vocabFetch_TYPES;
  langFilters: string[];
  sortDirection: "descending" | "ascending";
  targetList_ID?: string | undefined;
}

const function_NAME = "USE_fetchPublicVocabs";

export function USE_fetchPublicVocabs({
  z_INSERT_publicVocabsError,
  z_INSERT_fetchedVocabs,
  z_PREPARE_publicVocabsForFetch,
}: {
  z_INSERT_publicVocabsError: z_INSERT_publicVocabsError_TYPE;
  z_INSERT_fetchedVocabs: z_INSERT_fetchedVocabs_TYPE;
  z_PREPARE_publicVocabsForFetch: z_PREPARE_publicVocabsForFetch_TYPE;
}) {
  const { START_newRequest } = USE_abortController();

  const FETCH_publicVocabs = useCallback(
    async (args: USE_fetchPublicVocabs_PROPS): Promise<void> => {
      const {
        search = "",
        loadMore = false,
        excludeIds = new Set(),
        fetch_TYPE = "all",
        langFilters = [],
        sortDirection = "descending",
        targetList_ID = "",
      } = args;

      // Create new fetch request, so that we could cancel it in case
      // a new request was sent, and this one hasn't finished fetching
      const newController = START_newRequest();

      const loading_STATE: loadingState_TYPES = DETERMINE_loadingState({
        search,
        loadMore,
        difficultyFilters: [],
        langFilters,
      });

      z_PREPARE_publicVocabsForFetch({ loadMore, loading_STATE, fetch_TYPE });

      try {
        const { vocabs, unpaginated_COUNT } = await FETCH_vocabs({
          search,
          signal: newController.signal,
          amount: VOCAB_PAGINATION,
          user_id: "",
          fetch_TYPE,
          list_TYPE: "public",
          excludeIds,
          list_id: targetList_ID,
          difficultyFilters: [],
          langFilters,
          sortDirection,
          sorting: "date",
        });

        if (!vocabs)
          throw new General_ERROR({
            function_NAME,
            message:
              "'FETCH_vocabs' returned an undefined 'vocabs' object, although it didn't throw an error",
          });

        if (typeof unpaginated_COUNT !== "number")
          throw new General_ERROR({
            function_NAME,
            message:
              "'FETCH_vocabs' returned an 'unpaginated_COUNT' that wasn't a number, although it didn't throw an error",
          });

        // Do not update the reducer state if signal has been aborted (if fetch has been canceled).
        // Also, don't throw any errors, because the only reason this will abort is if a new fetch request has started.
        if (newController.signal.aborted) return;

        z_INSERT_fetchedVocabs({ vocabs, unpaginated_COUNT, loadMore });

        // --------------------------------------------------
      } catch (error: any) {
        if (error.message === "AbortError: Aborted") return;
        const err = new General_ERROR({
          function_NAME: error?.function_NAME || function_NAME,
          message: error?.message,
          errorToSpread: error,
        });

        z_INSERT_publicVocabsError(err);
        SEND_internalError(err);
      }
    },
    [
      DETERMINE_loadingState,
      z_INSERT_publicVocabsError,
      z_INSERT_fetchedVocabs,
      z_PREPARE_publicVocabsForFetch,
      START_newRequest,
    ]
  );

  return { FETCH_publicVocabs };
}
