//
//
//

import { Vocab_TYPE } from "@/src/features/vocabs/types";
import { supabase } from "@/src/lib/supabase";
import { General_ERROR } from "@/src/types/error_TYPES";

export const function_NAME = "UPDATE_vocabMarked";

export async function UPDATE_vocabMarked(
  vocab_ID: string,
  val: boolean
): Promise<{ data?: Vocab_TYPE }> {
  // validate args

  try {
    const { data, error } = await supabase
      .from("vocabs")
      .update({ is_marked: val })
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
