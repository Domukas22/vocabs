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
import { FETCH_vocabs } from "@/src/features_new/vocabs/functions/FETCH_vocabs/FETCH_vocabs";
import {
  List_TYPE,
  ListFilter_PROPS,
  ListSorting_PROPS,
} from "@/src/features_new/lists/types";
import { listFetch_TYPES } from "@/src/features_new/lists/functions/fetch/FETCH_lists/types";
import { FETCH_lists } from "@/src/features_new/lists/functions/fetch/FETCH_lists/FETCH_lists";
import { COLLECT_allListsLangIds } from "@/src/features_new/lists/functions/fetch/COLLECT_allListsLangIds/COLLECT_allListsLangIds";

interface USE_handleListsFetch_PROPS {
  SET_error: (error: General_ERROR) => void;
  APPEND_content: (
    lists: List_TYPE[],
    unpaginated_COUNT: number,
    loadMore: boolean
  ) => void;
  PREPARE_fetch: (_loading_STATE: loadingState_TYPES) => void;
  INSERT_collectedLangIds: (lang_ids: string[]) => void;
}

interface USE_fetchMyLists_PROPS {
  search: string;
  user_id: string;
  loadMore: boolean;
  excludeIds: Set<string>;
  fetch_TYPE: listFetch_TYPES;
  targetList_ID?: string | undefined;

  filters: ListFilter_PROPS;
  sorting: ListSorting_PROPS;

  IS_private: boolean;
}

const function_NAME = "USE_handleListsFetch";

export function USE_handleListsFetch({
  SET_error,
  APPEND_content,
  PREPARE_fetch,
  INSERT_collectedLangIds,
}: USE_handleListsFetch_PROPS) {
  const { START_newRequest } = USE_abortController();

  const _FETCH_lists = useCallback(
    async (args: USE_fetchMyLists_PROPS): Promise<void> => {
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

        IS_private = true,
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

      PREPARE_fetch(loading_STATE);

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

        const { lists, unpaginated_COUNT } = await FETCH_lists({
          search,
          signal: newController.signal,
          amount: VOCAB_PAGINATION,
          user_id,
          fetch_TYPE,
          list_TYPE: IS_private ? "private" : "public",
          excludeIds,
          list_id: targetList_ID,
          filters,
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

        INSERT_collectedLangIds(collectedLang_IDs);
        APPEND_content(lists, unpaginated_COUNT, loadMore);

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
      APPEND_content,
      PREPARE_fetch,
      START_newRequest,
      INSERT_collectedLangIds,
    ]
  );

  return { FETCH_lists: _FETCH_lists };
}
