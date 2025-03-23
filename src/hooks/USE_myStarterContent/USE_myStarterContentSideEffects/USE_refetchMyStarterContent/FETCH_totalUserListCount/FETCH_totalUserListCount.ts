//
//
//

import { General_ERROR } from "@/src/types/error_TYPES";
import { supabase } from "@/src/lib/supabase";

export const function_NAME = "FETCH_totalUserListCount";

export async function FETCH_totalUserListCount(
  user_id: string
): Promise<{ totalList_COUNT: number }> {
  if (!user_id)
    throw new General_ERROR({
      function_NAME,
      message: "'user_id' was undefined",
    });

  try {
    const { error, count } = await supabase
      .from("lists")
      .select(`id, user_id, type`, { count: "exact" })
      .eq("user_id", user_id)
      .eq("type", "private")
      .limit(3);

    if (error)
      throw new General_ERROR({
        function_NAME,
        message: error.message,
        errorToSpread: error,
      });

    return { totalList_COUNT: count || 0 };
  } catch (error: any) {
    throw new General_ERROR({
      function_NAME: error?.function_NAME || function_NAME,
      message: error?.message,
      errorToSpread: error,
    });
  }
}
