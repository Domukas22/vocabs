//
//
//

import { Vocab_MODEL } from "@/src/features/vocabs/types";
import { z_vocabDisplaySettings_PROPS } from "@/src/hooks/USE_zustand/USE_zustand";
import { Error_PROPS } from "@/src/props";

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
  z_vocabDisplay_SETTINGS: z_vocabDisplaySettings_PROPS;
}

export type FETCH_myVocabs_RESPONSE_TYPE = {
  data?: {
    vocabs: Vocab_MODEL[];
    unpaginated_COUNT: number;
  };
  error?: Error_PROPS;
};
