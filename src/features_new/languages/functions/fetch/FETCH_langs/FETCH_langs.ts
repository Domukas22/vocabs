//
//
//

//
//
//

import { supabase } from "@/src/lib/supabase";

import { General_ERROR } from "@/src/types/error_TYPES";
import { Lang_TYPE } from "../../../types";

export const function_NAME = "FETCH_langs";

export async function FETCH_langs(): Promise<{ langs: Lang_TYPE[] }> {
  try {
    // Build the supabase query
    let { data: langs, error } = await supabase.from("languages").select(`*`);

    if (error) {
      throw new General_ERROR({
        function_NAME: function_NAME,
        message: error?.message,
        errorToSpread: error,
      });
    }

    if (!langs) {
      throw new General_ERROR({
        function_NAME: function_NAME,
        message: "'langs' returned undefined, alought no error was thrown",
      });
    }

    // ---------------------------------------------------
    // Return valid data if fetch was successful
    return { langs };
    // ---------------------------------------------------
  } catch (error: any) {
    throw new General_ERROR({
      function_NAME: error?.function_NAME || function_NAME,
      message: error?.message,
      errorToSpread: error,
    });
  }
}
