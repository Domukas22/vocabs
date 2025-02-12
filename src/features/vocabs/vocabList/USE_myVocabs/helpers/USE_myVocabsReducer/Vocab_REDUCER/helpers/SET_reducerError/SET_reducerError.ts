//
//
//

import { vocabsReducer_TYPE, SET_error_PAYLOAD } from "../../types";

export function SET_reducerError(
  payload: SET_error_PAYLOAD
): vocabsReducer_TYPE {
  return {
    error: payload || undefined,
    loading_STATE: "error",
  };
}
