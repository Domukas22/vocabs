//
//
//

import { List_TYPE } from "@/src/features_new/lists/types";
import { supabase } from "@/src/lib/supabase";
import { General_ERROR } from "@/src/types/error_TYPES";

const function_NAME = "FETCH_onePublicList";

export async function FETCH_onePublicList(
  list_id: string
): Promise<{ list: List_TYPE }> {
  if (!list_id)
    throw new General_ERROR({
      function_NAME,
      message: "'list_id' was undefined",
    });

  try {
    const { data: list, error } = await supabase
      .from("lists_extended")
      .select(`*`)
      .eq("type", "public")
      .eq("id", list_id)
      .single();

    if (error)
      throw new General_ERROR({
        function_NAME,
        message: error.message,
        errorToSpread: error,
      });

    if (!list) {
      throw new General_ERROR({
        function_NAME,
        message: "'list' returned undefined, although no error was thrown",
      });
    }

    return { list };
  } catch (error: any) {
    throw new General_ERROR({
      function_NAME,
      message: error.message,
      errorToSpread: error,
    });
  }
}
