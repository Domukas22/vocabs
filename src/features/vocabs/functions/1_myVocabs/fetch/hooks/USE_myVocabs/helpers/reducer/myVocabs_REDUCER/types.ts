//
//
//

import { CREATE_internalErrorMsg } from "@/src/constants/globalVars";
import Vocab_MODEL from "@/src/db/models/Vocab_MODEL";
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

////////////////////////////////////////////////

export type myVocabs_REDUCER_RESPONSE_TYPE = {
  data?: {
    vocabs: Vocab_MODEL[];
    printed_IDS: Set<string>;
    unpaginated_COUNT: number;
    HAS_reachedEnd: boolean;
  };
  loading_STATE: loadingState_TYPES;
  error?: Error_PROPS;
};

export type internalErrMsg_TYPES =
  | "user_id_undefined"
  | "current_state_vocabs_array_undefined"
  | "current_state_unpaginated_count_is_not_number"
  | "payload_vocabs_array_undefined"
  | "payload_unpaginated_count_is_not_number"
  | "payload_vocab_id_undefined";

export type userErrMsg_TYPES = "defaultInternal_MSG" | "networkFailure";
type internalErrObj_PROPS = Record<internalErrMsg_TYPES, string>;
type userErrObj_PROPS = Record<userErrMsg_TYPES, string>;

const action = "reducing my vocabs";

export const myVocabs_REDUCER_ERRORS: {
  internal: internalErrObj_PROPS;
  user: userErrObj_PROPS;
} = {
  internal: {
    current_state_vocabs_array_undefined: `Vocabs array in the current reducer state was undefined when ${action}.`,
    current_state_unpaginated_count_is_not_number: `Unpaginated count in the current reducer state was undefined when ${action}.`,
    payload_vocabs_array_undefined: `Vocabs array in the payload undefined when ${action}.`,
    payload_unpaginated_count_is_not_number: `Unpaginated vocab count in the payload was not a number when ${action}.`,
    payload_vocab_id_undefined: `Vocab id in the payload was not a number when ${action}.`,
    user_id_undefined: `User id undefined when ${action}.`,
  },
  user: {
    defaultInternal_MSG: CREATE_internalErrorMsg("trying to fetch your vocabs"),
    networkFailure: "There seems to an issue with your internet connection.",
  },
};
