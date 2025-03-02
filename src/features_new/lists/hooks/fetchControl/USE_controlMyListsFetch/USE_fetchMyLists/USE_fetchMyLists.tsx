//
//
//

//
//
//

import { USE_abortController } from "@/src/hooks";
import {
  Filters_TYPE,
  loadingState_TYPES,
  sortDirection_TYPE,
} from "@/src/types/general_TYPES";
import { useCallback } from "react";
import { General_ERROR } from "@/src/types/error_TYPES";
import { VOCAB_PAGINATION } from "@/src/constants/globalVars";

import {
  z_INSERT_collectedLangIds_TYPE,
  z_INSERT_fetchedLists_TYPE,
  z_INSERT_myListsError_TYPE,
  z_PREPARE_myListsForFetch_TYPE,
} from "../../../zustand/z_USE_myLists/z_USE_myLists";
import DETERMINE_loadingState from "@/src/utils/DETERMINE_loadingState/DETERMINE_loadingState";
import { SEND_internalError } from "@/src/utils";
import { FETCH_lists } from "../../../../functions/fetch/FETCH_lists/FETCH_lists";
import { listFetch_TYPES } from "../../../../functions/fetch/FETCH_lists/types";
import { COLLECT_allListsLangIds } from "@/src/features_new/lists/functions/fetch/COLLECT_allListsLangIds/COLLECT_allListsLangIds";
import { MyListsSorting_TYPE } from "../../../zustand/displaySettings/z_USE_myListsDisplaySettings/z_USE_myListsDisplaySettings";
import { ListFilter_PROPS } from "@/src/features_new/lists/types";
import { filter } from "lodash";

interface USE_fetchMyLists_PROPS {
  search: string;
  user_id: string;
  loadMore: boolean;
  excludeIds: Set<string>;
  fetch_TYPE: listFetch_TYPES;
  sorting: MyListsSorting_TYPE;
  sortDirection: sortDirection_TYPE;
  targetList_ID?: string | undefined;
  filters: ListFilter_PROPS;
}

const function_NAME = "USE_fetchMyLists";

export function USE_fetchMyLists({
  z_INSERT_myListsError,
  z_INSERT_fetchedLists,
  z_PREPARE_myListsForFetch,
  z_INSERT_collectedLangIds,
}: {
  z_INSERT_myListsError: z_INSERT_myListsError_TYPE;
  z_INSERT_fetchedLists: z_INSERT_fetchedLists_TYPE;
  z_PREPARE_myListsForFetch: z_PREPARE_myListsForFetch_TYPE;
  z_INSERT_collectedLangIds: z_INSERT_collectedLangIds_TYPE;
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
        sortDirection = "descending",
        targetList_ID = "",
        sorting = "date",
        filters = {
          byMarked: false,
          difficulties: [],
          langs: [],
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

      z_PREPARE_myListsForFetch({ loadMore, loading_STATE, fetch_TYPE });

      try {
        // -------------------------------------------------
        // First, fetch the collected lang ids
        const { collectedLang_IDs } = await COLLECT_allListsLangIds({
          user_id,
          signal: newController.signal,
          type: "private",
        });

        if (!collectedLang_IDs)
          throw new General_ERROR({
            function_NAME,
            message:
              "'COLLECT_allMyListsLangIds' returned an undefined 'collectedLang_IDs' array, although it didn't throw an error",
          });

        // -------------------------------------------------
        // Then fetch the lists themselves
        const { lists, unpaginated_COUNT } = await FETCH_lists({
          search,
          signal: newController.signal,
          amount: VOCAB_PAGINATION,
          user_id,
          fetch_TYPE,
          list_TYPE: "private",
          excludeIds,
          list_id: targetList_ID,
          sortDirection,
          sorting,
          filters,
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

        // -------------------------------------------------
        // Do not update the reducer state if signal has been aborted (if fetch has been canceled).
        // Also, don't throw any errors, because the only reason this will abort is if a new fetch request has started.
        if (newController.signal.aborted) return;

        // -------------------------------------------------
        z_INSERT_collectedLangIds({ lang_IDs: collectedLang_IDs });
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
