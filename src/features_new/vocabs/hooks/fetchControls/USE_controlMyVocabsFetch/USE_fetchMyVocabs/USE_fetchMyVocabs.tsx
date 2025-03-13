//
//
//

import { USE_abortController } from "@/src/hooks";
import { loadingState_TYPES } from "@/src/types/general_TYPES";
import { useCallback } from "react";

import { General_ERROR } from "@/src/types/error_TYPES";
import { vocabFetch_TYPES } from "../../../../functions/FETCH_vocabs/types";

import { VOCAB_PAGINATION } from "@/src/constants/globalVars";
import { FETCH_vocabs } from "../../../../functions/FETCH_vocabs/FETCH_vocabs";
import {
  z_INSERT_fetchedVocabs_TYPE,
  z_INSERT_myVocabsError_TYPE,
  z_PREPARE_myVocabsForFetch_TYPE,
} from "../../../zustand/z_USE_myVocabs/z_USE_myVocabs";
import DETERMINE_loadingState from "@/src/utils/DETERMINE_loadingState/DETERMINE_loadingState";
import { SEND_internalError } from "@/src/utils";
import {
  VocabFilter_PROPS,
  VocabSorting_PROPS,
} from "@/src/features_new/vocabs/types";

interface USE_fetchMyVocabs_PROPS {
  search: string;
  user_id: string;
  loadMore: boolean;
  excludeIds: Set<string>;
  fetch_TYPE: vocabFetch_TYPES;
  targetList_ID?: string | undefined;

  filters: VocabFilter_PROPS;
  sorting: VocabSorting_PROPS;
}

const function_NAME = "USE_fetchMyVocabs";

export function USE_fetchMyVocabs({
  z_SET_error: z_INSERT_myVocabsError,
  z_APPEND_vocabs: z_INSERT_fetchedVocabs,
  z_PREPARE_vocabsFetch: z_PREPARE_myVocabsForFetch,
}: {
  z_SET_error: z_INSERT_myVocabsError_TYPE;
  z_APPEND_vocabs: z_INSERT_fetchedVocabs_TYPE;
  z_PREPARE_vocabsFetch: z_PREPARE_myVocabsForFetch_TYPE;
}) {
  const { START_newRequest } = USE_abortController();

  const FETCH_myVocabs = useCallback(
    async (args: USE_fetchMyVocabs_PROPS): Promise<void> => {
      const {
        search = "",
        user_id = "",
        loadMore = false,
        excludeIds = new Set(),
        fetch_TYPE = "all",
        targetList_ID = "",

        filters = {
          byMarked: false,
          difficulties: [],
          langs: [],
        },
        sorting = {
          type: "date",
          direction: "descending",
        },
      } = args;

      // Create new fetch request, so that we could cancel it in case
      // a new request was sent, and this one hasn't finished fetching
      const newController = START_newRequest();

      const HAS_filters =
        filters.difficulties.length > 0 ||
        filters.langs.length > 0 ||
        filters.byMarked;

      const loading_STATE: loadingState_TYPES = DETERMINE_loadingState({
        search,
        loadMore,
        HAS_filters,
      });

      z_PREPARE_myVocabsForFetch({ loadMore, loading_STATE, fetch_TYPE });

      try {
        const { vocabs, unpaginated_COUNT } = await FETCH_vocabs({
          search,
          signal: newController.signal,
          amount: VOCAB_PAGINATION,
          user_id,
          fetch_TYPE,
          list_TYPE: "private",
          excludeIds,
          list_id: targetList_ID,
          filters,
          sorting,
        });

        if (!vocabs)
          throw new General_ERROR({
            function_NAME,
            message:
              "'FETCH_vocabs' returned an undefined 'vocabs' array, although it didn't throw an error",
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

        z_INSERT_myVocabsError(err);
        SEND_internalError(err);
      }
    },
    [
      DETERMINE_loadingState,
      z_INSERT_myVocabsError,
      z_INSERT_fetchedVocabs,
      z_PREPARE_myVocabsForFetch,
      START_newRequest,
    ]
  );

  return { FETCH_myVocabs };
}
