//
//
//

import Vocab_MODEL from "@/src/db/models/Vocab_MODEL";
import { loadingState_TYPES } from "@/src/types";

export type myVocabsReducerState_PROPS = {
  data:
    | {
        vocabs: Vocab_MODEL[];
        printed_IDS: Set<string>;
        unpaginated_COUNT: number;
        HAS_reachedEnd: boolean;
      }
    | undefined;
  error: { value: boolean; msg: string };
  loading_STATE: loadingState_TYPES;
};

export type myVocabsReducerAction_PROPS =
  | { type: "ADD_VOCAB"; payload: Vocab_MODEL }
  | {
      type: "UPDATE_STATE";
      payload: { vocabs: Vocab_MODEL[]; unpaginated_COUNT: number };
    }
  | { type: "DELETE_VOCAB"; payload: string }
  | { type: "SET_LOADING_STATE"; payload: loadingState_TYPES }
  | { type: "SET_ERROR"; payload: { value: boolean; msg: string } }
  | { type: "RESET_STATE" };
