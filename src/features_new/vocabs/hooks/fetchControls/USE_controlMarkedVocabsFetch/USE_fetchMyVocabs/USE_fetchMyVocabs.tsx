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

import DETERMINE_loadingState from "@/src/utils/DETERMINE_loadingState/DETERMINE_loadingState";
import { SEND_internalError } from "@/src/utils";
import {
  MarkedVocabFilter_PROPS,
  VocabFilter_PROPS,
  VocabSorting_PROPS,
} from "@/src/features_new/vocabs/types";
import {
  APPEND_vocabs_TYPE,
  PREPATE_forFetch_TYPE,
  SET_error_TYPE,
} from "../../../zustand/z_USE_markedVocabs/z_USE_markedVocabs";

interface USE_fetchMarkedVocabs_PROPS {
  search: string;
  user_id: string;
  loadMore: boolean;
  excludeIds: Set<string>;

  filters: MarkedVocabFilter_PROPS;
  sorting: VocabSorting_PROPS;
}

const function_NAME = "USE_fetchMarkedVocabs";
const fetch_TYPE = "marked";

export function USE_fetchMarkedVocabs({
  z_SET_error,
  z_APPEND_vocabs,
  z_PREPATE_forFetch,
}: {
  z_SET_error: SET_error_TYPE;
  z_APPEND_vocabs: APPEND_vocabs_TYPE;
  z_PREPATE_forFetch: PREPATE_forFetch_TYPE;
}) {
  const { START_newRequest } = USE_abortController();

  const FETCH_markedVocabs = useCallback(
    async (args: USE_fetchMarkedVocabs_PROPS): Promise<void> => {
      const {
        search = "",
        user_id = "",
        loadMore = false,
        excludeIds = new Set(),

        filters = {
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
        filters.difficulties.length > 0 || filters.langs.length > 0;

      const loading_STATE: loadingState_TYPES = DETERMINE_loadingState({
        search,
        loadMore,
        HAS_filters,
      });

      z_PREPATE_forFetch({ loadMore, loading_STATE });

      try {
        const { vocabs, unpaginated_COUNT } = await FETCH_vocabs({
          search,
          signal: newController.signal,
          amount: VOCAB_PAGINATION,
          user_id,
          fetch_TYPE,
          list_TYPE: "private",
          excludeIds,
          list_id: "",
          filters: { ...filters, byMarked: true },
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

        z_APPEND_vocabs({ vocabs, unpaginated_COUNT, loadMore });

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
    [
      DETERMINE_loadingState,
      z_SET_error,
      z_APPEND_vocabs,
      z_PREPATE_forFetch,
      START_newRequest,
    ]
  );

  return { FETCH_markedVocabs };
}
