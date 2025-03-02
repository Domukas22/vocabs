//
//
//

import {
  Vocab_TYPE,
  VocabFilter_PROPS,
  VocabSorting_PROPS,
} from "@/src/features_new/vocabs/types";
import { PostgrestFilterBuilder } from "@supabase/postgrest-js";
import { itemVisibility_TYPE } from "@/src/types/general_TYPES";

export type vocabFetch_TYPES = "byTargetList" | "all" | "deleted" | "marked";

export interface FETCH_myVocabs_ARG_TYPES {
  search: string;
  signal: AbortSignal;
  amount: number;
  user_id: string;
  list_id: string;
  list_TYPE: itemVisibility_TYPE;
  excludeIds: Set<string>;
  fetch_TYPE: vocabFetch_TYPES;
  sorting: VocabSorting_PROPS;
  filters: VocabFilter_PROPS;
}

export type FETCH_myVocabs_RESPONSE_TYPE = {
  vocabs: Vocab_TYPE[];
  unpaginated_COUNT: number;
};

export type VocabQuery_TYPE = PostgrestFilterBuilder<
  any,
  any,
  any[],
  "vocabs",
  unknown
>;
