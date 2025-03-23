//
//
//
//

import { List_TYPE, ListFilter_PROPS } from "../../types";
import { MyListsSorting_TYPE } from "../zustand/displaySettings/z_USE_myListsDisplaySettings/z_USE_myListsDisplaySettings";
import {
  loadingState_TYPES,
  sortDirection_TYPE,
} from "@/src/types/general_TYPES";
import { User_TYPE } from "@/src/features_new/user/types";
import { useCallback, useEffect, useState } from "react";
import { General_ERROR } from "@/src/types/error_TYPES";
import {
  USE_appendContent,
  USE_highlighedId,
  USE_prepareFetch,
} from "@/src/hooks";
import { USE_handleListsFetch } from "./helpers/USE_handleListsFetch/USE_handleListsFetch";
import { listFetch_TYPES } from "../../functions/fetch/FETCH_lists/types";
import { USE_handleMyListsSideEffects } from "./helpers/USE_handleMyListsSideEffects/USE_handleMyListsSideEffects";

export function USE_lists({
  search = "",
  fetch_TYPE = "all",
  targetList_ID = "",
  IS_private = false,
  filters = { byMarked: false, difficulties: [], langs: [] },
  sorting = { direction: "descending", type: "date" },
  user,
}: {
  search: string;
  fetch_TYPE: listFetch_TYPES;
  targetList_ID?: string;
  IS_private: boolean;
  filters: ListFilter_PROPS;
  sorting: {
    type: MyListsSorting_TYPE;
    direction: sortDirection_TYPE;
  };
  user: User_TYPE | undefined;
}) {
  const [lists, SET_lists] = useState<List_TYPE[]>([]);
  const [printed_IDS, SET_printedIds] = useState<Set<string>>(
    new Set<string>()
  );
  const [lang_IDS, SET_langIds] = useState<string[]>([]);
  const [unpaginated_COUNT, SET_unpaginatedCount] = useState<number>(0);
  const [HAS_reachedEnd, SET_hasReachedEnd] = useState<boolean>(false);
  const [loading_STATE, SET_loadingState] =
    useState<loadingState_TYPES>("none");
  const [error, SET_error] = useState<General_ERROR>();
  const { highlight, highlighted_ID } = USE_highlighedId();

  const { PREPARE_fetch } = USE_prepareFetch({ SET_error, SET_loadingState });

  const { APPEND_content } = USE_appendContent({
    current_ARR: lists,
    SET_content: SET_lists,
    SET_printedIds,
    SET_loadingState,
    SET_hasReachedEnd,
    SET_unpaginatedCount,
  });

  /////------------------------

  const { FETCH_lists } = USE_handleListsFetch({
    APPEND_content,
    PREPARE_fetch,
    SET_error,
    INSERT_collectedLangIds: (lang_ids) => SET_langIds(lang_ids),
  });

  const _FETCH_lists = useCallback(
    async (loadMore: boolean = false) => {
      FETCH_lists({
        search,
        user_id: user?.id || "",
        loadMore,
        excludeIds: loadMore ? printed_IDS : new Set(),
        fetch_TYPE,
        targetList_ID,
        sorting,
        filters,
        IS_private,
      });
    },
    [filters, sorting, user?.id, printed_IDS, search]
  );

  // Refetch on search / sorting / filter / targetList_ID
  useEffect(() => {
    (async () => await _FETCH_lists())();
  }, [search, filters, sorting, targetList_ID]);

  const LOAD_more = useCallback(async () => {
    (async () => await _FETCH_lists(true))();
  }, [_FETCH_lists]);

  USE_handleMyListsSideEffects({
    lists,
    highlight,
    SET_lists,
    SET_unpaginatedCount,
  });

  return {
    lists,
    lang_IDS,
    unpaginated_COUNT,
    HAS_reachedEnd,
    error,
    loading_STATE,
    highlighted_ID,
    LOAD_more,
  };
}
