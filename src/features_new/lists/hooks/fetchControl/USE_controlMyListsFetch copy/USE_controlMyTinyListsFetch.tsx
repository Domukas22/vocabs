//
//
//

//
//
//

import { useCallback, useEffect } from "react";
import { USE_fetchMyTinyLists } from "./USE_fetchMyLists/USE_fetchMyTinyLists";
import { z_USE_user } from "@/src/features_new/user/hooks/z_USE_user/z_USE_user";

export default function USE_controlMyTinyListsFetch({
  search = "",
}: {
  search: string;
}) {
  const { z_user } = z_USE_user();

  const {
    FETCH_myTinyLists,
    HAS_reachedEnd,
    error,
    loading_STATE,
    tiny_LISTS,
    unpaginated_COUNT,
  } = USE_fetchMyTinyLists();

  const FETCH = useCallback(
    async (loadMore: boolean = false) => {
      FETCH_myTinyLists({
        search,
        user_id: z_user?.id || "",
        loadMore,
      });
    },
    [z_user?.id, search]
  );

  // Refetch on search
  useEffect(() => {
    (async () => await FETCH())();
  }, [search]);

  const LOAD_more = useCallback(async () => {
    (async () => await FETCH(true))();
  }, [FETCH]);

  return {
    LOAD_more,
    HAS_reachedEnd,
    error,
    loading_STATE,
    tiny_LISTS,
    unpaginated_COUNT,
  };
}
