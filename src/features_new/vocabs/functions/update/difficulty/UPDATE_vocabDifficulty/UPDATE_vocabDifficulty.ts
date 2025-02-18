//
//
//

import { raw_Vocab_TYPE } from "@/src/features_new/vocabs/types";
import { supabase } from "@/src/lib/supabase";
import { General_ERROR } from "@/src/types/error_TYPES";

export const function_NAME = "UPDATE_vocabDifficulty";

export async function UPDATE_vocabDifficulty(
  vocab_ID: string,
  new_DIFFICULTY: 1 | 2 | 3
): Promise<{ data?: raw_Vocab_TYPE }> {
  // validate args

  try {
    const { data, error } = await supabase
      .from("vocabs")
      .update({ difficulty: new_DIFFICULTY })
      .eq("id", vocab_ID)
      .select()
      .single();

    if (error)
      throw new General_ERROR({
        function_NAME,
        message: error.message,
        errorToSpread: error,
      });

    return { data };
  } catch (error: any) {
    throw new General_ERROR({
      function_NAME,
      message: error.message,
      errorToSpread: error,
    });
  }
}
