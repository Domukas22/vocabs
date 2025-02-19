//
//
//

import { raw_Vocab_TYPE } from "@/src/features_new/vocabs/types";
import { supabase } from "@/src/lib/supabase";
import { General_ERROR } from "@/src/types/error_TYPES";

export const function_NAME = "DELETE_vocab";

export async function SOFTDELETE_vocab(
  vocab_ID: string,
  user_ID: string
): Promise<void> {
  if (!vocab_ID)
    throw new General_ERROR({
      function_NAME,
      message: "'vocab_ID' was undefined",
    });
  if (!user_ID)
    throw new General_ERROR({
      function_NAME,
      message: "'user_ID' was undefined",
    });

  try {
    const { error } = await supabase
      .from("vocabs")
      .update({ deleted_at: new Date().toISOString(), list_id: null })
      .eq("id", vocab_ID)
      .eq("user_id", user_ID)
      .select()
      .single();

    if (error)
      throw new General_ERROR({
        function_NAME,
        message: error.message,
        errorToSpread: error,
      });
  } catch (error: any) {
    throw new General_ERROR({
      function_NAME,
      message: error.message,
      errorToSpread: error,
    });
  }
}
