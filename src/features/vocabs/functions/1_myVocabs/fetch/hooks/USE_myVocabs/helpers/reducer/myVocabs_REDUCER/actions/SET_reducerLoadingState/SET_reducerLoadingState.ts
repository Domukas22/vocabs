//
//
//

import { loadingState_TYPES } from "@/src/types";
import { myVocabsReducerState_PROPS } from "../../types";

export function SET_reducerLoadingState(
  state: myVocabsReducerState_PROPS,
  payload: loadingState_TYPES
): myVocabsReducerState_PROPS {
  return { ...state, loading_STATE: payload };
}
