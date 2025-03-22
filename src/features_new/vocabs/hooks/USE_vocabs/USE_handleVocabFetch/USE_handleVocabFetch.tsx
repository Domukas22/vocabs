//
//
//

import { USE_abortController } from "@/src/hooks";
import { loadingState_TYPES } from "@/src/types/general_TYPES";
import { useCallback } from "react";

import { General_ERROR } from "@/src/types/error_TYPES";

import { VOCAB_PAGINATION } from "@/src/constants/globalVars";
import DETERMINE_loadingState from "@/src/utils/DETERMINE_loadingState/DETERMINE_loadingState";
import { SEND_internalError } from "@/src/utils";
import {
  Vocab_TYPE,
  VocabFilter_PROPS,
  VocabSorting_PROPS,
} from "@/src/features_new/vocabs/types";
import { vocabFetch_TYPES } from "../../../functions/FETCH_vocabs/types";
import { FETCH_vocabs } from "../../../functions/FETCH_vocabs/FETCH_vocabs";

interface USE_handleVocabFetch_PROPS {
  SET_error: (error: General_ERROR) => void;
  APPEND_vocabs: (
    vocabs: Vocab_TYPE[],
    unpaginated_COUNT: number,
    loadMore: boolean
  ) => void;
  PREPARE_vocabsFetch: (_loading_STATE: loadingState_TYPES) => void;
}

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

const function_NAME = "USE_handleVocabFetch";

export function USE_handleVocabFetch({
  SET_error,
  APPEND_vocabs,
  PREPARE_vocabsFetch,
}: USE_handleVocabFetch_PROPS) {
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

      PREPARE_vocabsFetch(loading_STATE);

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

        APPEND_vocabs(vocabs, unpaginated_COUNT, loadMore);

        // --------------------------------------------------
      } catch (error: any) {
        if (error.message === "AbortError: Aborted") return;
        const err = new General_ERROR({
          function_NAME: error?.function_NAME || function_NAME,
          message: error?.message,
          errorToSpread: error,
        });

        SET_error(err);
        SEND_internalError(err);
      }
    },
    [
      DETERMINE_loadingState,
      SET_error,
      APPEND_vocabs,
      PREPARE_vocabsFetch,
      START_newRequest,
    ]
  );

  return { FETCH_myVocabs };
}
