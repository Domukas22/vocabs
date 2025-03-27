//
//
//

import { supabase } from "@/src/lib/supabase";
import { General_ERROR } from "@/src/types/error_TYPES";

const function_NAME = "FETCH_currentUserMaxVocabCount";

export async function FETCH_currentUserMaxVocabCount(user_id: string) {
  if (!user_id)
    throw new General_ERROR({
      function_NAME,
      message: "'user_id' was undefined",
    });
  try {
    const { data: user_OBJ, error } = await supabase
      .from("users")
      .select(`max_vocabs`)
      .eq("id", user_id)
      .filter("deleted_at", "is", null)
      .single();

    if (error)
      throw new General_ERROR({
        function_NAME,
        message: error.message,
        errorToSpread: error,
      });

    if (!user_OBJ || typeof user_OBJ?.max_vocabs !== "number") {
      throw new General_ERROR({
        function_NAME,
        message: "'user_OBJ.max_vocabs' was not a number",
      });
    }

    return { maxVocab_COUNT: user_OBJ.max_vocabs };
  } catch (error: any) {
    throw new General_ERROR({
      function_NAME,
      message: error.message,
      errorToSpread: error,
    });
  }
}
