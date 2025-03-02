//
//
//

import { General_ERROR } from "@/src/types/error_TYPES";
import { PostgrestError } from "@supabase/supabase-js";

export function THROW_postgressError(
  error: PostgrestError,
  function_NAME = "No function name provided"
) {
  throw new General_ERROR({
    message: error?.message,
    function_NAME,
    errorToSpread: error,
  });
}
