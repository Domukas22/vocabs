//
//
//

import { useCallback, useEffect, useRef } from "react";
import { USE_fetchMarkedVocabs } from "./USE_fetchMyVocabs/USE_fetchMyVocabs";
import { z_USE_user } from "@/src/features_new/user/hooks/z_USE_user/z_USE_user";
import { USE_collectMyVocabsLangIds } from "./USE_collectMyVocabsLangIds/USE_collectMyVocabsLangIds";
import { z_USE_markedVocabsSettings } from "../../zustand/displaySettings/z_USE_markedVocabsSettings/z_USE_markedVocabsSettings";
import { z_USE_markedVocabs } from "../../zustand/z_USE_markedVocabs/z_USE_markedVocabs";

// TODO --> finishthe marked vocabs fetch control hook. Perhapls modularize some function tha tyou will use for other control hooks

export default function USE_controlMarkedVocabsFetch({
  search = "",
}: {
  search: string;
}) {
  const { filters, sorting } = z_USE_markedVocabsSettings();
  const { z_user } = z_USE_user();

  const {
    z_printed_IDS,
    z_lang_IDS,
    z_SET_error,
    z_APPEND_vocabs,
    z_PREPATE_forFetch,
    z_SET_langIds,
  } = z_USE_markedVocabs();

  const { FETCH_markedVocabs } = USE_fetchMarkedVocabs({
    z_SET_error,
    z_APPEND_vocabs,
    z_PREPATE_forFetch,
  });

  const { COLLECT_langIds } = USE_collectMyVocabsLangIds({
    z_INSERT_myVocabsError: z_SET_error,
    z_SET_myVocabsCollectedLangIds: z_SET_langIds,
  });

  const FETCH = useCallback(
    async (loadMore: boolean = false) => {
      FETCH_markedVocabs({
        search,
        loadMore,
        filters,
        sorting,
        user_id: z_user?.id || "",
        excludeIds: loadMore ? z_printed_IDS : new Set(),
      });
    },
    [filters, sorting, z_user?.id, z_printed_IDS, search]
  );

  // Refetch on search / sorting / filter / targetList_ID
  useEffect(() => {
    (async () => await FETCH())();
  }, [search, sorting, filters]);

  // recalculate lang ids on targetList_ID change
  useEffect(() => {
    (async () => {
      await COLLECT_langIds({
        fetch_TYPE: "marked",
        targetList_ID: "",
        user_ID: z_user?.id || "",
      });
    })();
  }, []);

  const LOAD_more = useCallback(async () => {
    (async () => await FETCH(true))();
  }, [FETCH]);

  return { LOAD_more };
}
