//
//
//

//
//
//

import { USE_zustand } from "@/src/hooks";
import { useCallback, useEffect } from "react";

import { USE_fetchPublicLists } from "./USE_fetchPublicLists/USE_fetchPublicLists";
import { listFetch_TYPES } from "../FETCH_lists/types";
import { z_USE_publicLists } from "../../zustand/z_USE_publicLists/z_USE_myLists";

export default function USE_controlPublicListsFetch({
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
    z_publicListsPrinted_IDS,
    z_INSERT_publicListsError,
    z_INSERT_fetchedLists,
    z_PREPARE_publicListsForFetch,
  } = z_USE_publicLists();

  const { FETCH_publicLists } = USE_fetchPublicLists({
    z_INSERT_publicListsError,
    z_INSERT_fetchedLists,
    z_PREPARE_publicListsForFetch,
  });

  const FETCH = useCallback(
    async (loadMore: boolean = false) => {
      FETCH_publicLists({
        search,
        user_id: z_user?.id || "",
        loadMore,
        excludeIds: loadMore ? z_publicListsPrinted_IDS : new Set(),
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
      z_publicListsPrinted_IDS,
      search,
    ]
  );

  // Refetch on search / sorting / filter / targetList_ID
  useEffect(() => {
    (async () => await FETCH())();
  }, [search, langFilters, sortDirection, sorting, targetList_ID]);

  const LOAD_more = useCallback(async () => {
    (async () => await FETCH(true))();
  }, []);

  return { LOAD_more };
}
