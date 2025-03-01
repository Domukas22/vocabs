//
//
//

import { supabase } from "@/src/lib/supabase";
import { General_ERROR } from "@/src/types/error_TYPES";

import { List_TYPE } from "@/src/features_new/lists/types";
import { REDUCE_collectedLangIds } from "@/src/utils";

export const function_NAME = "RECOLLECT_listLangIds";

export async function RECOLLECT_listLangIds(
  list_id: string,
  user_id: string
): Promise<{ updated_LIST: List_TYPE }> {
  if (!list_id)
    throw new General_ERROR({
      function_NAME,
      message: "'list_id' was undefined",
    });
  if (!user_id)
    throw new General_ERROR({
      function_NAME,
      message: "'user_id' was undefined",
    });

  try {
    // Fetch the vocabs that point to the target list_id
    const { data: collectedLang_IDs, error: childrenVocabs_ERROR } =
      await supabase
        .from("vocabs")
        .select(`lang_ids`)
        .eq("list_id", list_id)
        .eq("user_id", user_id)
        .is("deleted_at", null);

    if (childrenVocabs_ERROR)
      throw new General_ERROR({
        function_NAME,
        message: childrenVocabs_ERROR.message,
        errorToSpread: childrenVocabs_ERROR,
      });

    // Convert lang ids into a string, example: "en, de, lt"
    const listLang_IDs = REDUCE_collectedLangIds(collectedLang_IDs);

    // Update the list
    const { data: list, error } = await supabase
      .from("lists_extended")
      .update({ collected_lang_ids: listLang_IDs })
      .eq("id", list_id)
      .eq("user_id", user_id)
      .select(`*`)
      .single();

    if (error)
      throw new General_ERROR({
        function_NAME,
        message: error.message,
        errorToSpread: error,
      });

    return { updated_LIST: list };
  } catch (error: any) {
    throw new General_ERROR({
      function_NAME,
      message: error.message,
      errorToSpread: error,
    });
  }
}
