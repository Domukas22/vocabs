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

import DETERMINE_loadingState from "@/src/utils/DETERMINE_loadingState/DETERMINE_loadingState";
import { SEND_internalError } from "@/src/utils";
import { FETCH_lists } from "../../../../functions/fetch/FETCH_lists/FETCH_lists";
import {
  listFetch_TYPES,
  listSorting_TYPES,
} from "../../../../functions/fetch/FETCH_lists/types";
import {
  z_INSERT_publicListsError_TYPE,
  z_PREPARE_publicListsForFetch_TYPE,
} from "../../../zustand/z_USE_publicLists/z_USE_publicLists";
import {
  z_INSERT_collectedLangIds_TYPE,
  z_INSERT_fetchedLists_TYPE,
} from "../../../zustand/z_USE_myLists/z_USE_myLists";
import { publicListsSorting_TYPE } from "../../../zustand/displaySettings/z_USE_publicListsDisplaySettings/z_USE_publicListsDisplaySettings";
import { COLLECT_allListsLangIds } from "@/src/features_new/lists/functions/fetch/COLLECT_allListsLangIds/COLLECT_allListsLangIds";
import { ListFilter_PROPS } from "@/src/features_new/lists/types";

interface USE_fetchPublicLists_PROPS {
  search: string;
  user_id: string;
  loadMore: boolean;
  excludeIds: Set<string>;
  fetch_TYPE: listFetch_TYPES;
  sortDirection: "descending" | "ascending";
  targetList_ID?: string | undefined;
  sorting: listSorting_TYPES;
  filters: ListFilter_PROPS;
}

const function_NAME = "USE_fetchPublicLists";

export function USE_fetchPublicLists({
  z_INSERT_publicListsError,
  z_INSERT_fetchedLists,
  z_PREPARE_publicListsForFetch,
  z_INSERT_collectedLangIds,
}: {
  z_INSERT_publicListsError: z_INSERT_publicListsError_TYPE;
  z_INSERT_fetchedLists: z_INSERT_fetchedLists_TYPE;
  z_PREPARE_publicListsForFetch: z_PREPARE_publicListsForFetch_TYPE;
  z_INSERT_collectedLangIds: z_INSERT_collectedLangIds_TYPE;
}) {
  const { START_newRequest } = USE_abortController();

  const FETCH_publicLists = useCallback(
    async (args: USE_fetchPublicLists_PROPS): Promise<void> => {
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

      z_PREPARE_publicListsForFetch({ loadMore, loading_STATE, fetch_TYPE });

      try {
        // -------------------------------------------------
        // First, fetch the collected lang ids
        const { collectedLang_IDs } = await COLLECT_allListsLangIds({
          type: "public",
          signal: newController.signal,
        });

        if (!collectedLang_IDs)
          throw new General_ERROR({
            function_NAME,
            message:
              "'COLLECT_allMyListsLangIds' returned an undefined 'collectedLang_IDs' array, although it didn't throw an error",
          });

        console.log(collectedLang_IDs);

        const { lists, unpaginated_COUNT } = await FETCH_lists({
          search,
          signal: newController.signal,
          amount: VOCAB_PAGINATION,
          user_id,
          fetch_TYPE,
          list_TYPE: "public",
          excludeIds,
          list_id: targetList_ID,
          filters,
          sortDirection,
          sorting,
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

        z_INSERT_publicListsError(err);
        SEND_internalError(err);
      }
    },
    [
      DETERMINE_loadingState,
      z_INSERT_publicListsError,
      z_INSERT_fetchedLists,
      z_PREPARE_publicListsForFetch,
      START_newRequest,
    ]
  );

  return { FETCH_publicLists };
}
