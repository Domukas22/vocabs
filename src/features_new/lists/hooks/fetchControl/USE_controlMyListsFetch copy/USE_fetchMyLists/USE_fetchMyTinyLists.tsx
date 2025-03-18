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
import { useCallback, useState } from "react";
import { General_ERROR } from "@/src/types/error_TYPES";
import { LIST_PAGINATION, VOCAB_PAGINATION } from "@/src/constants/globalVars";

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
import {
  ListFilter_PROPS,
  TinyList_TYPE,
} from "@/src/features_new/lists/types";
import { filter } from "lodash";
import { FETCH_myTinyLists } from "./FETCH_tinyLists/FETCH_myTinyLists";

interface USE_fetchMyTinyLists_PROPS {
  search: string;
  user_id: string;
  loadMore: boolean;
}

const function_NAME = "USE_fetchMyTinyLists";

export function USE_fetchMyTinyLists() {
  const { START_newRequest } = USE_abortController();

  const [loading_STATE, SET_loadingState] =
    useState<loadingState_TYPES>("none");
  const [tiny_LISTS, SET_tinyLists] = useState<TinyList_TYPE[]>([]);
  const [error, SET_error] = useState<General_ERROR | undefined>();
  const [excluded_IDS, SET_excludedIds] = useState<Set<string>>(new Set());
  const [unpaginated_COUNT, SET_unpaginatedCount] = useState(0);
  const [HAS_reachedEnd, SET_hasReachedEnd] = useState(false);

  const _FETCH_myTinyLists = useCallback(
    async (args: USE_fetchMyTinyLists_PROPS): Promise<void> => {
      const { search = "", user_id = "", loadMore = false } = args;

      // Create new fetch request, so that we could cancel it in case
      // a new request was sent, and this one hasn't finished fetching
      const newController = START_newRequest();

      try {
        const _loading_STATE: loadingState_TYPES = DETERMINE_loadingState({
          search,
          loadMore,
          HAS_filters: false,
        });

        SET_loadingState(_loading_STATE);
        SET_error(undefined);
        if (!loadMore) SET_tinyLists([]);

        // -------------------------------------------------
        // Then fetch the lists themselves
        const {
          tiny_LISTS: newTiny_LISTS,
          unpaginated_COUNT: newUnpaginated_COUNT,
        } = await FETCH_myTinyLists({
          search,
          signal: newController.signal,
          amount: LIST_PAGINATION,
          user_id,
          excludeIds: excluded_IDS,
        });

        if (!newTiny_LISTS)
          throw new General_ERROR({
            function_NAME,
            message:
              "'FETCH_myTinyLists' returned an undefined 'tiny_LISTS' array, although it didn't throw an error",
          });

        if (typeof newUnpaginated_COUNT !== "number")
          throw new General_ERROR({
            function_NAME,
            message:
              "'FETCH_myTinyLists' returned an 'unpaginated_COUNT' that wasn't a number, although it didn't throw an error",
          });

        // -------------------------------------------------
        // Do not update the reducer state if signal has been aborted (if fetch has been canceled).
        // Also, don't throw any errors, because the only reason this will abort is if a new fetch request has started.
        if (newController.signal.aborted) return;

        // -------------------------------------------------

        // Update the state
        if (loadMore) {
          const withNewlyAppendedList_ARR = [...tiny_LISTS, ...newTiny_LISTS];

          SET_tinyLists(withNewlyAppendedList_ARR);
          SET_excludedIds(new Set(withNewlyAppendedList_ARR.map((x) => x.id)));
          SET_hasReachedEnd(
            withNewlyAppendedList_ARR.length >= newUnpaginated_COUNT
          );
        } else {
          SET_tinyLists(newTiny_LISTS);
          SET_excludedIds(new Set(newTiny_LISTS.map((v) => v.id)));
          SET_hasReachedEnd(newTiny_LISTS.length >= newUnpaginated_COUNT);
        }

        SET_loadingState("none");
        SET_unpaginatedCount(newUnpaginated_COUNT);

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
      SET_tinyLists,
      SET_unpaginatedCount,
      START_newRequest,
      SET_loadingState,
      SET_excludedIds,
      SET_hasReachedEnd,
      excluded_IDS,
    ]
  );

  return {
    FETCH_myTinyLists: _FETCH_myTinyLists,
    tiny_LISTS,
    loading_STATE,
    error,
    unpaginated_COUNT,
    HAS_reachedEnd,
  };
}
