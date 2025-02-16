//
//
//

import { Vocab_TYPE } from "@/src/features/vocabs/types";
import { supabase } from "@/src/lib/supabase";
import { General_ERROR } from "@/src/types/error_TYPES";

export const function_NAME = "DELETE_vocab";

export async function SOFTDELETE_vocab(
  vocab_ID: string
): Promise<{ success?: boolean; error?: General_ERROR }> {
  // validate args

  try {
    const { error } = await supabase
      .from("vocabs")
      .update({ deleted_at: new Date().toISOString() })
      .eq("id", vocab_ID)
      .select()
      .single();

    if (error)
      throw new General_ERROR({
        function_NAME,
        message: error.message,
        errorToSpread: error,
      });

    return { success: true };
  } catch (error: any) {
    return {
      error: new General_ERROR({
        function_NAME,
        message: error.message,
        errorToSpread: error,
      }),
    };
  }
}
