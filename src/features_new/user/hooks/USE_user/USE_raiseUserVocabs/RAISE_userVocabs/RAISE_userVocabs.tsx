//
//
//

import { function_NAME } from "@/src/features_new/vocabs/functions/COLLECT_myVocabLangIds/COLLECT_myVocabLangIds";
import { supabase } from "@/src/lib/supabase";
import { General_ERROR } from "@/src/types/error_TYPES";

type props = {
  user_id: string;
  toAddVocab_COUNT: number;
  currentMaxVocab_COUNT: number;
};

export async function RAISE_userVocabs({
  user_id,
  currentMaxVocab_COUNT,
  toAddVocab_COUNT,
}: props) {
  if (!user_id)
    throw new General_ERROR({
      function_NAME,
      message: "'user_id' was undefined",
    });
  if (typeof toAddVocab_COUNT !== "number")
    throw new General_ERROR({
      function_NAME,
      message: "'toAddVocab_COUNT' was undefined",
    });
  if (typeof currentMaxVocab_COUNT !== "number")
    throw new General_ERROR({
      function_NAME,
      message: "'currentMaxVocab_COUNT' was undefined",
    });

  try {
    const { data: user_OBJ, error } = await supabase
      .from("users")
      .update({ max_vocabs: currentMaxVocab_COUNT + toAddVocab_COUNT })
      .eq("id", user_id)
      .filter("deleted_at", "is", null)
      .select(`*`)
      .single();

    if (error)
      throw new General_ERROR({
        function_NAME,
        message: error.message,
        errorToSpread: error,
      });

    if (!user_OBJ || typeof user_OBJ?.max_vocabs !== "number") {
      throw new General_ERROR({
        function_NAME,
        message: "'user_OBJ.max_vocabs' was not a number",
      });
    }

    return { newMaxVocab_COUNT: user_OBJ.max_vocabs };
  } catch (error: any) {
    throw new General_ERROR({
      function_NAME,
      message: error.message,
      errorToSpread: error,
    });
  }
}
