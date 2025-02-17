//
//
//

import { General_ERROR } from "@/src/types/error_TYPES";
import { vocabsReducer_TYPE, SET_error_PAYLOAD } from "../../types";

const function_NAME = "SET_reducerError";

export function SET_reducerError(
  payload: SET_error_PAYLOAD
): vocabsReducer_TYPE {
  const alternative_ERROR = new General_ERROR({
    function_NAME,
    message: "An error has been triggered, but hasn't been provided properly",
  });

  return {
    error: payload || alternative_ERROR,
    z_myVocabsLoading_STATE: "error",
  };
}
