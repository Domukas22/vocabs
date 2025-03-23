//
//
//

import { General_ERROR } from "@/src/types/error_TYPES";
import { supabase } from "@/src/lib/supabase";
import { Vocab_TYPE } from "@/src/features_new/vocabs/types";

export const function_NAME = "FETCH_topPublicVocabs";

export async function FETCH_topPublicVocabs(): Promise<{
  top_VOCABS: Vocab_TYPE[];
}> {
  try {
    const { data: vocabs, error } = await supabase
      .from("vocabs")
      .select(`*, list:lists (id,name)`)
      .filter("deleted_at", "is", null)
      .eq("type", "public")
      .order("saved_count", { ascending: false })
      .limit(3);

    if (error)
      throw new General_ERROR({
        function_NAME,
        message: error.message,
        errorToSpread: error,
      });

    return { top_VOCABS: vocabs };
  } catch (error: any) {
    throw new General_ERROR({
      function_NAME: error?.function_NAME || function_NAME,
      message: error?.message,
      errorToSpread: error,
    });
  }
}
