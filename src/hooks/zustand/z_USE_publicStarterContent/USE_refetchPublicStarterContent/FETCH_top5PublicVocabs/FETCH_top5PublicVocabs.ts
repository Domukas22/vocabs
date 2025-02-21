//
//
//

import { General_ERROR } from "@/src/types/error_TYPES";
import { supabase } from "@/src/lib/supabase";
import { Vocab_TYPE } from "@/src/features_new/vocabs/types";
import { FORMAT_rawVocabs } from "@/src/features_new/vocabs/functions/FETCH_vocabs/functions";

export const function_NAME = "FETCH_top5PublicVocabs";

export async function FETCH_top5PublicVocabs(): Promise<{
  top5_VOCABS: Vocab_TYPE[];
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

    const { formated_VOCABS } = FORMAT_rawVocabs(vocabs);

    return { top5_VOCABS: formated_VOCABS };
  } catch (error: any) {
    throw new General_ERROR({
      function_NAME: error?.function_NAME || function_NAME,
      message: error?.message,
      errorToSpread: error,
    });
  }
}
