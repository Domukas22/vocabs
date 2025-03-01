//
//
//

import { supabase } from "@/src/lib/supabase";
import { General_ERROR } from "@/src/types/error_TYPES";
import { List_TYPE } from "@/src/features_new/lists/types";

export const function_NAME = "UPDATE_listName";

export async function UPDATE_listName(
  list_id: string,
  user_id: string,
  new_NAME: string
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
  if (!new_NAME)
    throw new General_ERROR({
      function_NAME,
      message: "'new_NAME' was undefined",
    });

  try {
    const { data: list, error } = await supabase
      .from("lists_extended")
      .update({ name: new_NAME, updated_at: new Date().toISOString() })
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
