//
//
//

//
//
//

import { useCallback, useEffect } from "react";

import { USE_fetchPublicLists } from "./USE_fetchPublicLists/USE_fetchPublicLists";
import { listFetch_TYPES } from "../../../functions/fetch/FETCH_lists/types";
import { z_USE_publicLists } from "../../zustand/z_USE_publicLists/z_USE_publicLists";
import { z_USE_user } from "@/src/features_new/user/hooks/z_USE_user/z_USE_user";
import { z_USE_publicListsDisplaySettings } from "../../zustand/displaySettings/z_USE_publicListsDisplaySettings/z_USE_publicListsDisplaySettings";

export default function USE_controlPublicListsFetch({
  search = "",
  fetch_TYPE = "all",
  targetList_ID = "",
}: {
  search: string;
  fetch_TYPE: listFetch_TYPES;
  targetList_ID: string;
}) {
  const { z_publicListDisplay_SETTINGS } = z_USE_publicListsDisplaySettings();
  const { z_user } = z_USE_user();
  const { langFilters, sortDirection, sorting } = z_publicListDisplay_SETTINGS;

  const {
    z_publicListsPrinted_IDS,
    z_INSERT_publicListsError,
    z_INSERT_fetchedLists,
    z_PREPARE_publicListsForFetch,
    z_INSERT_collectedLangIds,
  } = z_USE_publicLists();

  const { FETCH_publicLists } = USE_fetchPublicLists({
    z_INSERT_publicListsError,
    z_INSERT_fetchedLists,
    z_PREPARE_publicListsForFetch,
    z_INSERT_collectedLangIds,
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
        sorting,
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
  }, [FETCH]);

  return { LOAD_more };
}
