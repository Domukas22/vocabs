//
//
//

import { General_ERROR } from "@/src/types/error_TYPES";
import { supabase } from "@/src/lib/supabase";

export const function_NAME = "FETCH_totalPublicVocabCount";

export async function FETCH_totalPublicVocabCount(): Promise<{
  totalVocab_COUNT: number;
}> {
  try {
    const { error, count } = await supabase
      .from("vocabs")
      .select("id", { count: "exact" })
      .is("deleted_at", null)
      .eq("type", "public");

    if (error)
      throw new General_ERROR({
        function_NAME,
        message: error.message,
        errorToSpread: error,
      });

    return { totalVocab_COUNT: count || 0 };
  } catch (error: any) {
    throw new General_ERROR({
      function_NAME: error?.function_NAME || function_NAME,
      message: error?.message,
      errorToSpread: error,
    });
  }
}
