//
//
//

import { supabase } from "@/src/lib/supabase";
import { General_ERROR } from "@/src/types/error_TYPES";
import { raw_List_TYPE } from "@/src/types/general_TYPES";

export const function_NAME = "FETCH_oneList";

export async function FETCH_oneList(
  user_id: string,
  list_id: string
): Promise<{ list?: raw_List_TYPE }> {
  if (!user_id)
    throw new General_ERROR({
      function_NAME,
      message: "'user_id' was undefined",
    });

  if (!list_id)
    throw new General_ERROR({
      function_NAME,
      message: "'list_id' was undefined",
    });

  try {
    const { data: list, error } = await supabase
      .from("lists")
      .select("*")
      .eq("id", list_id)
      .eq("user_id", user_id)
      .single();

    if (error)
      throw new General_ERROR({
        function_NAME,
        message: error.message,
        errorToSpread: error,
      });

    return { list };
  } catch (error: any) {
    throw new General_ERROR({
      function_NAME,
      message: error.message,
      errorToSpread: error,
    });
  }
}
