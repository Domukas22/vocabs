//
//
//

import { General_ERROR } from "@/src/types/error_TYPES";
import { supabase } from "@/src/lib/supabase";

export const function_NAME = "FETCH_totalUserVocabCount";

export async function FETCH_totalUserVocabCount(
  user_id: string
): Promise<{ allVocab_COUNT: number }> {
  if (!user_id)
    throw new General_ERROR({
      function_NAME,
      message: "'user_id' was undefined",
    });

  try {
    const { error, count } = await supabase
      .from("vocabs")
      .select("id", { count: "exact" })
      .is("deleted_at", null)
      .eq("user_id", user_id)
      .eq("type", "private");

    if (error)
      throw new General_ERROR({
        function_NAME,
        message: error.message,
        errorToSpread: error,
      });

    return { allVocab_COUNT: count || 0 };
  } catch (error: any) {
    throw new General_ERROR({
      function_NAME: error?.function_NAME || function_NAME,
      message: error?.message,
      errorToSpread: error,
    });
  }
}
