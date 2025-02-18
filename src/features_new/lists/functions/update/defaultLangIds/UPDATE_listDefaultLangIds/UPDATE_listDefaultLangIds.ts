//
//
//

import { supabase } from "@/src/lib/supabase";
import { General_ERROR } from "@/src/types/error_TYPES";
import { FORMAT_rawLists } from "../../../fetch/FETCH_lists/helpers";
import { List_TYPE } from "@/src/features_new/lists/types";

export const function_NAME = "UPDATE_listDefaultLangIds";

export async function UPDATE_listDefaultLangIds(
  list_id: string,
  user_id: string,
  newLang_IDs: string[]
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
  if (!newLang_IDs)
    throw new General_ERROR({
      function_NAME,
      message: "'newLang_IDs' was undefined",
    });

  try {
    const { data: list, error } = await supabase
      .from("lists")
      .update({
        default_lang_ids: newLang_IDs?.join(","),
        updated_at: new Date().toISOString(),
      })
      .eq("id", list_id)
      .eq("user_id", user_id)
      .is("vocabs.deleted_at", null)
      .select(`*, vocabs(difficulty, is_marked)`)
      .single();

    if (error)
      throw new General_ERROR({
        function_NAME,
        message: error.message,
        errorToSpread: error,
      });

    const { formated_LISTS } = FORMAT_rawLists([list]);

    return { updated_LIST: formated_LISTS?.[0] };
  } catch (error: any) {
    throw new General_ERROR({
      function_NAME,
      message: error.message,
      errorToSpread: error,
    });
  }
}
