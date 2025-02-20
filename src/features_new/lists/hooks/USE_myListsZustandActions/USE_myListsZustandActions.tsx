//
//
//

import { itemVisibility_TYPE } from "@/src/types/general_TYPES";
import { useCallback } from "react";
import { USE_abortController } from "../../../../hooks/USE_abortController/USE_abortController";
import { LIST_PAGINATION } from "@/src/constants/globalVars";
import { z_FETCH_listsArgument_TYPES } from "@/src/zustand/types";

export type USE_vocabZustandActions_ARGTYPES = {
  search: string;
  user_id: string;
  list_TYPE: itemVisibility_TYPE;
  langFilters: string[];
  sortDirection: "ascending" | "descending";
  FETCH_l: (args: z_FETCH_listsArgument_TYPES) => Promise<void>;
};

export function USE_myListsZustandActions(
  args: USE_vocabZustandActions_ARGTYPES
) {
  const {
    search,
    user_id,
    list_TYPE,
    langFilters,
    sortDirection,
    FETCH_l = () => Promise.resolve(),
  } = args;

  const { START_newRequest } = USE_abortController();
  const FETCH_lists = useCallback(
    async (loadMore: boolean = false) => {
      const newController = START_newRequest();
      await FETCH_l({
        search,
        user_id,
        list_TYPE,
        langFilters,
        sortDirection,
        amount: LIST_PAGINATION,
        signal: newController.signal,
        loadMore,
      });
    },
    [search, langFilters, sortDirection]
  );

  return { FETCH_lists };
}
