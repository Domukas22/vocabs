//
//
//

import { myVocabsReducerState_PROPS } from "../../types";

export function SET_reducerError(
  state: myVocabsReducerState_PROPS,
  payload: { value: boolean; msg: string }
): myVocabsReducerState_PROPS {
  return { ...state, error: payload };
}
