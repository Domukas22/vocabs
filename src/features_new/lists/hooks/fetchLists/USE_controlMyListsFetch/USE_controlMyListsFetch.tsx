//
//
//

//
//
//

import { USE_zustand } from "@/src/hooks";
import { useCallback, useEffect } from "react";

import { USE_fetchMyLists } from "./USE_fetchMyLists/USE_fetchMyLists";
import { z_USE_myLists } from "../../zustand/z_USE_myLists/z_USE_myLists";
import { listFetch_TYPES } from "../FETCH_lists/types";

export default function USE_controlMyListsFetch({
  search = "",
  fetch_TYPE = "all",
  targetList_ID = "",
}: {
  search: string;
  fetch_TYPE: listFetch_TYPES;
  targetList_ID: string;
}) {
  const { z_user, z_listDisplay_SETTINGS } = USE_zustand();
  const { langFilters, sortDirection, sorting } = z_listDisplay_SETTINGS;

  const {
    z_myListsPrinted_IDS,
    z_INSERT_myListsError,
    z_INSERT_fetchedLists,
    z_PREPARE_myListsForFetch,
  } = z_USE_myLists();

  const { FETCH_myLists } = USE_fetchMyLists({
    z_INSERT_myListsError,
    z_INSERT_fetchedLists,
    z_PREPARE_myListsForFetch,
  });

  const FETCH = useCallback(
    async (loadMore: boolean = false) => {
      FETCH_myLists({
        search,
        user_id: z_user?.id || "",
        loadMore,
        excludeIds: loadMore ? z_myListsPrinted_IDS : new Set(),
        fetch_TYPE,
        targetList_ID,
        langFilters,
        sortDirection,
      });
    },
    [
      langFilters,
      sortDirection,
      sorting,
      z_user?.id,
      z_myListsPrinted_IDS,
      search,
    ]
  );

  // Refetch on search / sorting / filter / targetList_ID
  useEffect(() => {
    (async () => await FETCH())();
  }, [search, langFilters, sortDirection, sorting, targetList_ID]);

  const LOAD_more = useCallback(async () => {
    (async () => await FETCH(true))();
  }, [FETCH]);

  return { LOAD_more };
}
