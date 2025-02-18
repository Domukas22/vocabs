//
//
//

import { list_TYPES } from "@/src/features_new/vocabs/functions/fetch/FETCH_vocabs/types";
import { loadingState_TYPES } from "@/src/types/general_TYPES";

export type z_FETCH_listsArgument_TYPES = {
  search: string;
  user_id: string;
  list_TYPE: list_TYPES;

  langFilters: string[];
  sortDirection: "ascending" | "descending";

  amount: number;
  signal: AbortSignal;

  loadMore: boolean;
};
