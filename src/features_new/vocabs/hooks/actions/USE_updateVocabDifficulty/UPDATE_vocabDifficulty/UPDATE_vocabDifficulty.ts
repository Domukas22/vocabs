//
//
//

import { raw_Vocab_TYPE, Vocab_TYPE } from "@/src/features_new/vocabs/types";
import { supabase } from "@/src/lib/supabase";
import { General_ERROR } from "@/src/types/error_TYPES";

export const function_NAME = "UPDATE_vocabDifficulty";

export async function UPDATE_vocabDifficulty(
  vocab_ID: string,
  user_ID: string,
  new_DIFFICULTY: 1 | 2 | 3
): Promise<{ updated_VOCAB?: Vocab_TYPE }> {
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

  if (!new_DIFFICULTY)
    throw new General_ERROR({
      function_NAME,
      message: "'new_DIFFICULTY' was undefined",
    });

  try {
    const { data: vocab, error } = await supabase
      .from("vocabs")
      .update({ difficulty: new_DIFFICULTY })
      .eq("id", vocab_ID)
      .eq("user_id", user_ID)
      .select("* , list:lists (id,name)")
      .single();

    if (error)
      throw new General_ERROR({
        function_NAME,
        message: error.message,
        errorToSpread: error,
      });

    return { updated_VOCAB: vocab };
  } catch (error: any) {
    throw new General_ERROR({
      function_NAME,
      message: error.message,
      errorToSpread: error,
    });
  }
}
