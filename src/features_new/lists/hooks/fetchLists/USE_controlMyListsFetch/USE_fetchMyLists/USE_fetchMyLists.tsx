//
//
//

//
//
//

import { USE_abortController } from "@/src/hooks";
import { loadingState_TYPES } from "@/src/types/general_TYPES";
import { useCallback } from "react";
import { General_ERROR } from "@/src/types/error_TYPES";
import { VOCAB_PAGINATION } from "@/src/constants/globalVars";

import {
  z_INSERT_fetchedLists_TYPE,
  z_INSERT_myListsError_TYPE,
  z_PREPARE_myListsForFetch_TYPE,
} from "../../../zustand/z_USE_myLists/z_USE_myLists";
import DETERMINE_loadingState from "@/src/utils/DETERMINE_loadingState/DETERMINE_loadingState";
import { SEND_internalError } from "@/src/utils";
import { FETCH_lists } from "../../FETCH_lists/FETCH_lists";
import { listFetch_TYPES } from "../../FETCH_lists/types";

interface USE_fetchMyLists_PROPS {
  search: string;
  user_id: string;
  loadMore: boolean;
  excludeIds: Set<string>;
  fetch_TYPE: listFetch_TYPES;
  langFilters: string[];
  sortDirection: "descending" | "ascending";
  targetList_ID?: string | undefined;
}

const function_NAME = "USE_fetchMyLists";

export function USE_fetchMyLists({
  z_INSERT_myListsError,
  z_INSERT_fetchedLists,
  z_PREPARE_myListsForFetch,
}: {
  z_INSERT_myListsError: z_INSERT_myListsError_TYPE;
  z_INSERT_fetchedLists: z_INSERT_fetchedLists_TYPE;
  z_PREPARE_myListsForFetch: z_PREPARE_myListsForFetch_TYPE;
}) {
  const { START_newRequest } = USE_abortController();

  const FETCH_myLists = useCallback(
    async (args: USE_fetchMyLists_PROPS): Promise<void> => {
      const {
        search = "",
        user_id = "",
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
        difficultyFilters: [], // no filtering by difficulty for lists
        langFilters,
      });

      z_PREPARE_myListsForFetch({ loadMore, loading_STATE, fetch_TYPE });

      try {
        const { lists, unpaginated_COUNT } = await FETCH_lists({
          search,
          signal: newController.signal,
          amount: VOCAB_PAGINATION,
          user_id,
          fetch_TYPE,
          list_TYPE: "private",
          excludeIds,
          list_id: targetList_ID,
          langFilters,
          sortDirection,
        });

        if (!lists)
          throw new General_ERROR({
            function_NAME,
            message:
              "'FETCH_lists' returned an undefined 'lists' array, although it didn't throw an error",
          });

        if (typeof unpaginated_COUNT !== "number")
          throw new General_ERROR({
            function_NAME,
            message:
              "'FETCH_lists' returned an 'unpaginated_COUNT' that wasn't a number, although it didn't throw an error",
          });

        // Do not update the reducer state if signal has been aborted (if fetch has been canceled).
        // Also, don't throw any errors, because the only reason this will abort is if a new fetch request has started.
        if (newController.signal.aborted) return;

        z_INSERT_fetchedLists({ lists, unpaginated_COUNT, loadMore });

        // --------------------------------------------------
      } catch (error: any) {
        if (error.message === "AbortError: Aborted") return;
        const err = new General_ERROR({
          function_NAME: error?.function_NAME || function_NAME,
          message: error?.message,
          errorToSpread: error,
        });

        z_INSERT_myListsError(err);
        SEND_internalError(err);
      }
    },
    [
      DETERMINE_loadingState,
      z_INSERT_myListsError,
      z_INSERT_fetchedLists,
      z_PREPARE_myListsForFetch,
      START_newRequest,
    ]
  );

  return { FETCH_myLists };
}
