//
//
//

import { supabase } from "@/src/lib/supabase";
import { General_ERROR } from "@/src/types/error_TYPES";

export const function_NAME = "DELETE_list";

export async function DELETE_list(
  list_ID: string,
  user_ID: string
): Promise<void> {
  if (!list_ID)
    throw new General_ERROR({
      function_NAME,
      message: "'list_id' was undefined",
    });
  if (!user_ID)
    throw new General_ERROR({
      function_NAME,
      message: "'user_id' was undefined",
    });

  try {
    // First, softDelete vocabs
    const { error: softDeleteVocabs_ERROR } = await supabase
      .from("vocabs")
      .update({ deleted_at: new Date().toISOString(), list_id: null })
      .eq("list_id", list_ID)
      .eq("user_id", user_ID);

    if (softDeleteVocabs_ERROR)
      throw new General_ERROR({
        function_NAME,
        message: softDeleteVocabs_ERROR.message,
        errorToSpread: softDeleteVocabs_ERROR,
      });

    // Then delete the list
    const { error } = await supabase
      .from("lists")
      .delete()
      .eq("id", list_ID)
      .eq("user_id", user_ID);

    if (error)
      throw new General_ERROR({
        function_NAME,
        message: error.message,
        errorToSpread: error,
      });
  } catch (error: any) {
    throw new General_ERROR({
      function_NAME,
      message: error.message,
      errorToSpread: error,
    });
  }
}
