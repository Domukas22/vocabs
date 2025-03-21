//
//
//

import { General_ERROR } from "@/src/types/error_TYPES";
import { supabase } from "@/src/lib/supabase";
import { List_TYPE } from "@/src/features_new/lists/types";

export const function_NAME = "FETCH_myTopLists";

export async function FETCH_myTopLists(
  user_id: string
): Promise<{ top_LISTS: List_TYPE[] }> {
  if (!user_id)
    throw new General_ERROR({
      function_NAME,
      message: "'user_id' was undefined",
    });

  try {
    const { data: lists, error } = await supabase
      .from("lists_extended")
      .select(`*`)
      .eq("user_id", user_id)
      .eq("type", "private")
      .order("updated_at", { ascending: false })
      .limit(3);

    if (error)
      throw new General_ERROR({
        function_NAME,
        message: error.message,
        errorToSpread: error,
      });

    return { top_LISTS: lists };
  } catch (error: any) {
    throw new General_ERROR({
      function_NAME: error?.function_NAME || function_NAME,
      message: error?.message,
      errorToSpread: error,
    });
  }
}
