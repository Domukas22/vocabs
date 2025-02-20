//
//
//

import { FORMAT_rawVocabs } from "@/src/features_new/vocabs/hooks/fetchVocabs/FETCH_vocabs/functions";
import { raw_Vocab_TYPE, Vocab_TYPE } from "@/src/features_new/vocabs/types";
import { supabase } from "@/src/lib/supabase";
import { General_ERROR } from "@/src/types/error_TYPES";

export const function_NAME = "MARK_vocab";

export async function MARK_vocab(
  vocab_ID: string,
  user_ID: string,
  val: boolean
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
  if (typeof val !== "boolean")
    throw new General_ERROR({
      function_NAME,
      message: "'val' was not a boolean",
    });

  try {
    const { data: vocab, error } = await supabase
      .from("vocabs")
      .update({ is_marked: val })
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

    const { formated_VOCABS } = FORMAT_rawVocabs([vocab]);

    return { updated_VOCAB: formated_VOCABS[0] };
  } catch (error: any) {
    throw new General_ERROR({
      function_NAME,
      message: error.message,
      errorToSpread: error,
    });
  }
}
