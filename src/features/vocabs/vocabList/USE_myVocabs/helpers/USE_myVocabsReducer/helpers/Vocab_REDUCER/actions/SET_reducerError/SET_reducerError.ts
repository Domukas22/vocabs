//
//
//

import { Error_PROPS } from "@/src/props";
import { myVocabs_REDUCER_RESPONSE_TYPE } from "../../types";

export function SET_reducerError(
  state: myVocabs_REDUCER_RESPONSE_TYPE,
  payload: Error_PROPS | undefined
): myVocabs_REDUCER_RESPONSE_TYPE {
  return {
    ...state,
    error: payload || undefined,
  };
}
