//
//
//

import { General_ERROR } from "@/src/types/error_TYPES";
import { supabase } from "@/src/lib/supabase";
import { List_TYPE } from "@/src/features_new/lists/types";

export const function_NAME = "FETCH_topPublicLists";

export async function FETCH_topPublicLists(): Promise<{
  top_LISTS: List_TYPE[];
}> {
  try {
    const { data: lists, error } = await supabase
      .from("lists_extended")
      .select(`*`)
      .eq("type", "public")
      .order("saved_count", { ascending: false })
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
