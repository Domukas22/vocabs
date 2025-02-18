//
//
//

import { Vocab_TYPE } from "@/src/features_new/vocabs/types";
import { PostgrestFilterBuilder } from "@supabase/postgrest-js";
import { Error_PROPS, General_ERROR } from "@/src/types/error_TYPES";
import { list_TYPES } from "@/src/features_new/lists/types";

export type myVocabFetch_TYPES = "byTargetList" | "all" | "deleted" | "marked";

export interface FETCH_myVocabs_ARG_TYPES {
  search: string;
  signal: AbortSignal;
  amount: number;
  user_id: string;
  list_id: string;
  list_TYPE: list_TYPES;
  excludeIds: Set<string>;
  fetch_TYPE: myVocabFetch_TYPES;
  difficultyFilters: (1 | 2 | 3)[];
  langFilters: string[];
  sortDirection: "ascending" | "descending";
  sorting: "difficulty" | "date" | "shuffle";
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
