//
//
//

import { supabase } from "@/src/lib/supabase";
import { General_ERROR } from "@/src/types/error_TYPES";

export const function_NAME = "RESET_allDifficultiesOfAList";

export async function RESET_allDifficultiesOfAList(
  list_id: string,
  user_id: string
): Promise<void> {
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
    const { error } = await supabase
      .from("vocabs")
      .update({ difficulty: 3 })
      .eq("list_id", list_id)
      .eq("user_id", user_id);

    if (error)
      throw new General_ERROR({
        function_NAME,
        message: error?.message,
        errorToSpread: error,
      });

    const { error: listUpdate_ERROR } = await supabase
      .from("lists")
      .update({ updated_at: new Date().toISOString() })
      .eq("list_id", list_id)
      .eq("user_id", user_id);

    if (listUpdate_ERROR)
      throw new General_ERROR({
        function_NAME,
        message: listUpdate_ERROR?.message,
        errorToSpread: listUpdate_ERROR,
      });
  } catch (error: any) {
    throw new General_ERROR({
      function_NAME,
      message: error.message,
      errorToSpread: error,
    });
  }
}
