//
//
//

import { supabase } from "@/src/lib/supabase";
import { General_ERROR } from "@/src/types/error_TYPES";
import { List_TYPE } from "../../../types";
import { privateOrPublic_TYPE } from "@/src/types/general_TYPES";

export const function_NAME = "FETCH_oneList";

export async function FETCH_oneList(
  list_id: string,
  user_id: string,
  list_TYPE: privateOrPublic_TYPE
): Promise<{ list?: List_TYPE }> {
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

  if (!list_TYPE)
    throw new General_ERROR({
      function_NAME,
      message: "'list_TYPE' was undefined",
    });

  try {
    const { data: list, error } = await (list_TYPE === "private"
      ? supabase
          .from("lists_extended")
          .select(`*`)
          .eq("id", list_id)
          .eq("user_id", user_id)
          .eq("type", "private")
          .single()
      : supabase
          .from("lists_extended")
          .select(`*`)
          .eq("id", list_id)
          .eq("type", "public")
          .single());

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
