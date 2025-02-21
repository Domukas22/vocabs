//
//
//

import { General_ERROR } from "@/src/types/error_TYPES";
import { supabase } from "@/src/lib/supabase";

export const function_NAME = "FETCH_savedUserVocabCount";

export async function FETCH_savedUserVocabCount(
  user_id: string
): Promise<{ savedVocab_COUNT: number }> {
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
      .eq("is_marked", true)
      .eq("type", "private")
      .eq("user_id", user_id);

    if (error)
      throw new General_ERROR({
        function_NAME,
        message: error.message,
        errorToSpread: error,
      });

    return { savedVocab_COUNT: count || 0 };
  } catch (error: any) {
    throw new General_ERROR({
      function_NAME: error?.function_NAME || function_NAME,
      message: error?.message,
      errorToSpread: error,
    });
  }
}
