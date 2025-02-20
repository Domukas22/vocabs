//
//
//

import { supabase } from "@/src/lib/supabase";
import { General_ERROR } from "@/src/types/error_TYPES";
import { List_TYPE } from "../../../types";
import { FORMAT_rawLists } from "../../../hooks/fetchLists/FETCH_lists/helpers";
import { itemVisibility_TYPE } from "@/src/types/general_TYPES";

export const function_NAME = "FETCH_oneList";

export async function FETCH_oneList(
  list_id: string,
  user_id: string,
  list_TYPE: itemVisibility_TYPE
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
          .from("lists")
          .select(`*, vocabs(difficulty, is_marked)`)
          .is("vocabs.deleted_at", null)
          .eq("id", list_id)
          .eq("user_id", user_id)
          .eq("type", "private")
          .single()
      : supabase
          .from("lists")
          .select(`*, vocabs(difficulty, is_marked)`)
          .is("vocabs.deleted_at", null)
          .eq("id", list_id)
          .eq("type", "public")
          .single());

    if (error)
      throw new General_ERROR({
        function_NAME,
        message: error.message,
        errorToSpread: error,
      });

    const { formated_LISTS } = FORMAT_rawLists([list]);

    return { list: formated_LISTS?.[0] };
  } catch (error: any) {
    throw new General_ERROR({
      function_NAME,
      message: error.message,
      errorToSpread: error,
    });
  }
}
