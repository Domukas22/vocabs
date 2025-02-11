//
//
//

import { loadingState_TYPES } from "@/src/types";
import { myVocabs_REDUCER_RESPONSE_TYPE } from "../../types";

export function SET_reducerLoadingState(
  state: myVocabs_REDUCER_RESPONSE_TYPE,
  payload: loadingState_TYPES
): myVocabs_REDUCER_RESPONSE_TYPE {
  return { ...state, loading_STATE: payload || "none" };
}
