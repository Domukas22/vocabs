//
//
//

import { loadingState_TYPES } from "@/src/types/general_TYPES";
import {
  vocabList_TYPES,
  vocabFetch_TYPES,
} from "../../vocabList/USE_myVocabs/helpers/USE_fetchVocabs/helpers/FETCH_vocabs/types";

export type z_FETCH_vocabsArgument_TYPES = {
  search: string;
  signal: AbortSignal;
  amount: number;
  user_id: string;
  list_id: string;
  list_TYPE: vocabList_TYPES;

  fetch_TYPE: vocabFetch_TYPES;
  difficultyFilters: (1 | 2 | 3)[];
  langFilters: string[];
  sortDirection: "ascending" | "descending";
  sorting: "difficulty" | "date" | "shuffle";

  loadMore: boolean;
  loading_STATE: loadingState_TYPES | undefined;
};
