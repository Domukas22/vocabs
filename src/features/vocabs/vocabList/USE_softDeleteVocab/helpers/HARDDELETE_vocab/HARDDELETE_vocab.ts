//
//
//

import { Vocab_TYPE } from "@/src/features/vocabs/types";
import { supabase } from "@/src/lib/supabase";
import { General_ERROR } from "@/src/types/error_TYPES";

export const function_NAME = "HARDDELETE_vocab";

export async function HARDDELETE_vocab(
  vocab_ID: string
): Promise<{ success?: boolean }> {
  // validate args

  if (!vocab_ID)
    throw new General_ERROR({
      function_NAME,
      message: "'vocab_ID' was undefined",
    });

  try {
    const { error } = await supabase.from("vocabs").delete().eq("id", vocab_ID);

    if (error)
      throw new General_ERROR({
        function_NAME,
        message: error.message,
        errorToSpread: error,
      });

    return { success: true };
  } catch (error: any) {
    throw new General_ERROR({
      function_NAME,
      message: error.message,
      errorToSpread: error,
    });
  }
}
