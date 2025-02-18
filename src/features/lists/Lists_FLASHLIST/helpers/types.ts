//
//
//

import { list_TYPES } from "@/src/features/vocabs/vocabList/USE_myVocabs/helpers/USE_fetchVocabs/helpers/FETCH_vocabs/types";
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

export interface currentListAction_TYPE {
  list_id: string;
  action: "deleting" | "updating" | "copying";
}
