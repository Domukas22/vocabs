//
//
//

import { raw_Vocab_TYPE } from "@/src/features_new/vocabs/types";
import { General_ERROR } from "@/src/types/error_TYPES";
import { loadingState_TYPES } from "@/src/types/general_TYPES";
import { FETCH_myVocabs_RESPONSE_TYPE } from "../../../../../../../features_new/vocabs/hooks/USE_fetchVocabs/FETCH_vocabs/types";

export type PREPEND_oneVocab_PAYLOAD = raw_Vocab_TYPE;
export type UPDATE_oneVocab_PAYLOAD = raw_Vocab_TYPE;
export type APPEND_manyVocabs_PAYLOAD = FETCH_myVocabs_RESPONSE_TYPE;
export type DELETE_oneVocab_PAYLOAD = string;
export type SET_error_PAYLOAD = General_ERROR;
export type START_fetch_PAYLOAD = loadingState_TYPES;

export type myVocabsReducerAction_PROPS =
  | { type: "PREPEND_oneVocab"; payload: PREPEND_oneVocab_PAYLOAD }
  | { type: "UPDATE_oneVocab"; payload: UPDATE_oneVocab_PAYLOAD }
  | {
      type: "APPEND_manyVocabs";
      payload: APPEND_manyVocabs_PAYLOAD;
    }
  | { type: "DELETE_oneVocab"; payload: DELETE_oneVocab_PAYLOAD }
  | {
      type: "SET_error";
      payload: SET_error_PAYLOAD;
    }
  | { type: "START_fetch"; payload: START_fetch_PAYLOAD };

export type vocabsReducer_TYPE = {
  data?: {
    vocabs: raw_Vocab_TYPE[];
    printed_IDS: Set<string>;
    unpaginated_COUNT: number;
    HAS_reachedEnd: boolean;
  };
  z_myVocabsLoading_STATE?: loadingState_TYPES;
  error?: General_ERROR;
};
