//
//
//

import { Vocab_MODEL } from "@/src/features/vocabs/types";
import { Error_PROPS } from "@/src/props";
import { loadingState_TYPES } from "@/src/types";

export type myVocabsReducerAction_PROPS =
  | { type: "ADD_VOCAB"; payload: Vocab_MODEL }
  | {
      type: "ADD_VOCABS_TO_PAGINATION";
      payload: { vocabs: Vocab_MODEL[]; unpaginated_COUNT: number };
    }
  | { type: "DELETE_VOCAB"; payload: string }
  | { type: "SET_LOADING_STATE"; payload: loadingState_TYPES }
  | {
      type: "SET_ERROR";
      payload?: Error_PROPS;
    }
  | { type: "RESET_STATE"; payload: myVocabs_REDUCER_RESPONSE_TYPE };

export type myVocabs_REDUCER_RESPONSE_TYPE = {
  data?: {
    vocabs: Vocab_MODEL[];
    printed_IDS: Set<string>;
    unpaginated_COUNT: number;
    HAS_reachedEnd: boolean;
  };
  loading_STATE?: loadingState_TYPES;
  error?: Error_PROPS;
};
