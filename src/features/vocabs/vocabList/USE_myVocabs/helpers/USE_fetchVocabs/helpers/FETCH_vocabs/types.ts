//
//
//

import { Vocab_TYPE } from "@/src/features/vocabs/types";
import { PostgrestFilterBuilder } from "@supabase/postgrest-js";
import { Error_PROPS, General_ERROR } from "@/src/types/error_TYPES";

export type vocabFetch_TYPES = "byTargetList" | "all" | "deleted" | "marked";
export type vocabList_TYPES = "private" | "public";

export interface FETCH_myVocabs_ARG_TYPES {
  search: string;
  signal: AbortSignal;
  amount: number;
  user_id: string;
  list_TYPE: vocabList_TYPES;
  excludeIds: Set<string>;
  fetch_TYPE: vocabFetch_TYPES;
  targetList_ID?: string;
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
