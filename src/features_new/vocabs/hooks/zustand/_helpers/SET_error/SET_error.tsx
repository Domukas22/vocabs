//
//
//

import { General_ERROR } from "@/src/types/error_TYPES";
import { loadingState_TYPES } from "@/src/types/general_TYPES";

export function SET_error(error: General_ERROR) {
  return () => ({
    z_vocabs: [],
    z_loading_STATE: "error" as loadingState_TYPES,
    z_error: error,
  });
}
